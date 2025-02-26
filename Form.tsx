import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { toast } from "react-hot-toast"

interface FormProps<T extends z.ZodType<any, any>> {
  schema: T
  onSubmit: (data: z.infer<T>) => void
  children: (props: {
    register: ReturnType<typeof useForm>["register"]
    errors: Record<string, any>
    isSubmitting: boolean
  }) => React.ReactNode
}

export function Form<T extends z.ZodType<any, any>>({ schema, onSubmit, children }: FormProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const handleFormSubmit = async (data: z.infer<T>) => {
    try {
      await onSubmit(data)
      toast.success("Form submitted successfully")
    } catch (error) {
      toast.error("Failed to submit form")
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {children({ register, errors, isSubmitting })}
    </form>
  )
}

