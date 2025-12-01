import { throwError } from "rxjs";

export function handleHttpError(context: string) {
  return (error: any) => {
    console.error(`Error: `, error);
    return throwError(() => new Error(`${context}`));
  }
}
