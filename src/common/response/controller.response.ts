import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";


export class ControllerResponse<T> {
  constructor(data: T, message: string, status: HttpStatus) {
    this.data = data;
    this.message = message;
    this.status = status;
  }

  @ApiProperty({
    description: "데이터",
  })
  public readonly data: T;

  @ApiProperty({
    description: "메시지",
    example: "success",
  })
  public readonly message: string;

  @ApiProperty({
    description: "상태 코드",
    example: HttpStatus.OK,
  })
  public readonly status: HttpStatus;

  static success<T>(data: T, message = "success"): ControllerResponse<T> {
    return new ControllerResponse(data, message, HttpStatus.OK);
  }

  static error<T>(
    data: T,
    message = "error",
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ): ControllerResponse<T> {
    return new ControllerResponse(data, message, status);
  }
}