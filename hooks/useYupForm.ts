import { useForm, type UseFormProps, type FieldValues } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import type * as yup from "yup"

export function useYupForm<TFieldValues extends FieldValues = FieldValues, TContext = any>(
  schema: yup.ObjectSchema<any>,
  options?: UseFormProps<TFieldValues, TContext>,
) {
  return useForm<TFieldValues, TContext>({
    ...options,
    resolver: yupResolver(schema),
  })
}

