import type { NextFunction, Request, Response } from "express";

/**
 * Express 4 does not await async route handlers; rejections must be forwarded with `next(err)`.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    void Promise.resolve(fn(req, res, next)).catch(next);
  };
}
