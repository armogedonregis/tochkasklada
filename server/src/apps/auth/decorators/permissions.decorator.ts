import { SetMetadata } from '@nestjs/common';

export const RequirePermissions = (...permissions: string[]) => SetMetadata('permissions', permissions);

export const RequirePermission = (
  permission: string,
  resourceType?: string,
  resourceIdParam: string = 'id'
) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata('permissions', [permission])(target, propertyKey, descriptor);
    if (resourceType) {
      SetMetadata('resourceType', resourceType)(target, propertyKey, descriptor);
      SetMetadata('resourceIdParam', resourceIdParam)(target, propertyKey, descriptor);
    }
  };
};
