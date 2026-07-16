import { Request, Response, NextFunction } from "express";

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      // Should never happen if requireAuth ran first, but guard anyway.
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "You don't have permission to perform this action" });
    }
    next();
  };
};
