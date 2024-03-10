import {
  ControllerRenderProps,
  DefaultValues,
  FieldValues,
  Path,
  useForm,
} from "react-hook-form";
import { ZodObject, ZodRawShape } from "zod";
import {
  FormField,
  Form,
  FormItem,
  FormControl,
  FormDescription,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { HTMLInputTypeAttribute, useEffect, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";

export type Field<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  description?: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  className?: string;
  defaultValue: DefaultValues<T>;
  component?: React.ComponentType<{
    field: ControllerRenderProps<T, Path<T>>;
    fieldProps: Field<T>;
  }>;
};

type FormProps<T extends FieldValues> = {
  fields: Field<T>[];
  formSchema: ZodObject<ZodRawShape>;
  gridTemplateAreas?: string;
  gridTemplateColumns?: string;
  onSubmit: (data: T) => void;
  resetButton?: boolean;
};

export function FormComponent<T extends FieldValues>({
  fields,
  formSchema,
  gridTemplateAreas,
  gridTemplateColumns,
  onSubmit,
  resetButton,
}: FormProps<T>) {
  const parent = useRef<HTMLFormElement>(null);
  const form = useForm<T>({
    resolver: zodResolver(formSchema),
    defaultValues: fields.reduce((acc, field) => {
      acc[field.name as keyof DefaultValues<T>] =
        field.defaultValue[field.name as keyof DefaultValues<T>];
      return acc;
    }, {} as DefaultValues<T>),
  });

  useEffect(() => {
    parent.current &&
      parent.current
        .querySelectorAll(".animate-form")
        .forEach((el) => autoAnimate(el as HTMLElement));
  }, [parent]);

  return (
    <Form {...form}>
      <form
        ref={parent}
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4"
        style={{
          gridTemplateAreas,
          gridTemplateColumns,
        }}
      >
        {fields.map((fieldProps = {} as Field<T>) => {
          const Component = fieldProps.component || DefaultFormItem;
          return (
            <FormField
              control={form.control}
              key={fieldProps.name}
              name={fieldProps.name}
              render={({ field }) => (
                <Component field={field} fieldProps={fieldProps} />
              )}
            />
          );
        })}
        {resetButton && (
          <Button
            type="reset"
            onClick={() => {
              form.reset();
            }}
            style={{ gridArea: "reset" }}
          >
            Reset
          </Button>
        )}
        <Button type="submit" style={{ gridArea: "submit" }}>
          Submit
        </Button>
      </form>
    </Form>
  );
}

const DefaultFormItem = <T extends FieldValues>({
  field,
  fieldProps,
}: {
  field: ControllerRenderProps<T, Path<T>>;
  fieldProps: Field<T>;
}) => {
  return (
    <FormItem style={{ gridArea: fieldProps.name }}>
      <FormLabel>{fieldProps?.label}</FormLabel>
      <FormControl>
        <Input
          className={fieldProps?.className}
          placeholder={fieldProps?.placeholder}
          type={fieldProps?.type}
          {...field}
        />
      </FormControl>
      <FormDescription>{fieldProps?.description}</FormDescription>
      <FormMessage />
    </FormItem>
  );
};
