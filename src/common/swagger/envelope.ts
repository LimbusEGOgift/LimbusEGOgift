import { ControllerResponse } from "../response/controller.response";
import {
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Type,
  applyDecorators,
} from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from "@nestjs/swagger";

type SwaggerPrimitive =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor;

interface ErrorResponseSpec {
  status: HttpStatus;
  description: string;
}

type ApiDocSuccessType<T = any> =
  | Type<T>
  | SwaggerPrimitive
  | void
  | [Type<T>]
  | [SwaggerPrimitive];

interface ApiDocOptions<TModel extends ApiDocSuccessType> {
  summary: string;
  description?: string;
  successType?: TModel;
  errorResponses?: ErrorResponseSpec[];
}

const isArrayType = (type: any): type is [Type<any>] | [SwaggerPrimitive] => {
  return Array.isArray(type) && type.length === 1;
};

const isPrimitive = (type: any): type is SwaggerPrimitive => {
  return type === String || type === Number || type === Boolean;
};

export const ApiDoc = <TModel extends ApiDocSuccessType>(
  options: ApiDocOptions<TModel>,
) => {
  const { summary, description, successType, errorResponses = [] } = options;

  // 기본 에러 응답들 추가
  const defaultErrorResponses: ErrorResponseSpec[] = [
    { status: HttpStatus.BAD_REQUEST, description: "잘못된 요청" },
    { status: HttpStatus.INTERNAL_SERVER_ERROR, description: "서버 에러" },
  ];

  const allErrorResponses = [...defaultErrorResponses, ...errorResponses];

  const decorators = [ApiOperation({ summary, description })];

  // 성공 응답 처리
  if (successType !== undefined) {
    const isVoid = successType === undefined || successType === (void 0 as any);
    const isArray = isArrayType(successType);
    const itemType = isArray ? successType[0] : successType;
    const isItemPrimitive = isPrimitive(itemType);

    const successSchema: any = {
      allOf: [{ $ref: getSchemaPath(ControllerResponse) }],
    };

    if (!isVoid) {
      let dataSchema: any;

      if (isArray) {
        // 배열 타입 처리
        dataSchema = {
          type: "array",
          items: isItemPrimitive
            ? { type: primitiveToSwaggerType(itemType as SwaggerPrimitive) }
            : { $ref: getSchemaPath(itemType as Type<any>) },
        };
      } else {
        // 단일 타입 처리
        dataSchema = isItemPrimitive
          ? { type: primitiveToSwaggerType(itemType as SwaggerPrimitive) }
          : { $ref: getSchemaPath(itemType as Type<any>) };
      }

      successSchema.allOf.push({
        properties: {
          data: dataSchema,
        },
      });
    }

    decorators.push(
      ApiExtraModels(
        ControllerResponse,
        ...(isVoid || isItemPrimitive ? [] : [itemType as Type<any>]),
      ),
      ApiOkResponse({
        schema: successSchema,
        description: "성공 응답",
      }),
      HttpCode(HttpStatus.OK),
    );
  }

  // 에러 응답들 처리
  allErrorResponses.forEach(({ status, description: errorDescription }) => {
    decorators.push(
      ApiResponse({
        status,
        description: errorDescription,
        schema: {
          allOf: [{ $ref: getSchemaPath(ControllerResponse) }],
          properties: {
            data: { type: "object", nullable: false },
            message: { type: "string", example: errorDescription },
            status: { type: "number", example: status },
          },
        },
      }),
    );
  });

  return applyDecorators(...decorators);
};

export const ApiResponseType = <
  TModel extends Type<any> | SwaggerPrimitive | void,
>(
  model: TModel,
) => {
  const isVoid = model === undefined || model === (void 0 as any);
  const isPrimitive = model === String || model === Number || model === Boolean;

  const schema: any = {
    allOf: [{ $ref: getSchemaPath(ControllerResponse) }],
  };

  if (!isVoid) {
    schema.allOf.push({
      properties: {
        data: isPrimitive
          ? { type: primitiveToSwaggerType(model as SwaggerPrimitive) }
          : { $ref: getSchemaPath(model as Type<any>) },
      },
    });
  }

  return applyDecorators(
    ApiExtraModels(
      ControllerResponse,
      ...(isVoid || isPrimitive ? [] : [model as Type<any>]),
    ),
    ApiOkResponse({ schema }),
  );
};

function primitiveToSwaggerType(
  type: SwaggerPrimitive,
): "string" | "number" | "boolean" {
  switch (type) {
    case String:
      return "string";
    case Number:
      return "number";
    case Boolean:
      return "boolean";
    default:
      throw new InternalServerErrorException(
        `Unsupported primitive type: ${type}`,
      );
  }
}