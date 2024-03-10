import {
  ControllerRenderProps,
  DefaultValues,
  FieldValues,
  Path,
  useForm,
} from "react-hook-form";
import { ZodObject, ZodRawShape, z } from "zod";
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
import React, { HTMLInputTypeAttribute } from "react";

type Field<T extends FieldValues> = {
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
  onSubmit: (data: T) => void;
};

export function FormComponent<T extends FieldValues>({
  fields,
  formSchema,
  gridTemplateAreas,
  onSubmit,
}: FormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(formSchema),
    defaultValues: fields.reduce((acc, field) => {
      acc[field.name as keyof DefaultValues<T>] =
        field.defaultValue[field.name as keyof DefaultValues<T>];
      return acc;
    }, {} as DefaultValues<T>),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4"
        style={{ gridTemplateAreas }}
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

// TEST FORM COMPONENT

const TestForm = () => {
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const fields: Field<z.infer<typeof formSchema>>[] = [
    {
      name: "email",
      defaultValue: { email: "test" },
      component: (props) => {
        return (
          <FormItem style={{ gridArea: "email" }}>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                placeholder="Email"
                type="email"
                className="bg-blue-100 w-full"
                {...props.field}
              />
            </FormControl>
            <FormDescription>We'll never share your email.</FormDescription>
            <FormMessage />
          </FormItem>
        );
      },
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      className: "w-full bg-red-100",
      placeholder: "Password",
      defaultValue: { password: "" },
    },
  ];

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <FormComponent
      gridTemplateAreas="'password  email '  'submit .'"
      fields={fields}
      formSchema={formSchema}
      onSubmit={onSubmit}
    />
  );
};

export { TestForm };
