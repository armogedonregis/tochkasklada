import { SetMetadata } from '@nestjs/common';

export const RequireResourcePermission = (
  permission: string, 
  resourceType: string,
  resourceIdParam: string = 'id'
) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata('permissions', [permission])(target, propertyKey, descriptor);
    SetMetadata('resourceType', resourceType)(target, propertyKey, descriptor);
    SetMetadata('resourceIdParam', resourceIdParam)(target, propertyKey, descriptor);
  };
};
