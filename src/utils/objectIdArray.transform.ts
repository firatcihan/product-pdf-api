import { Types } from 'mongoose';
import { TransformFnParams, TransformationType } from 'class-transformer';

export const ObjectIdArrayTransform =
  () =>
  (params: TransformFnParams): Types.ObjectId[] | string[] => {
    const { value, type } = params;

    if (value == null) return [];

    if (!Array.isArray(value)) {
      if (typeof value === 'string' && Types.ObjectId.isValid(value)) {
        return type === TransformationType.PLAIN_TO_CLASS
          ? [new Types.ObjectId(value)]
          : [value];
      }
      return [];
    }

    if (type === TransformationType.CLASS_TO_PLAIN) {
      return value.map((v) =>
        v instanceof Types.ObjectId ? v.toHexString() : v
      );
    }

    if (type === TransformationType.PLAIN_TO_CLASS) {
      return value.map((v) => {
        if (typeof v !== 'string') return v as unknown as Types.ObjectId;

        if (!Types.ObjectId.isValid(v)) {
          throw new Error(`Invalid ObjectId: ${v}`);
        }
        return new Types.ObjectId(v);
      });
    }

    return value;
  };
