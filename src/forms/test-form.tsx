import { z } from "zod";
import { type Field, FormComponent } from "@/components/form/form";
import {
  FormDescription,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const TestForm = () => {
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const fields: Field<z.infer<typeof formSchema>>[] = [
    {
      name: "email",
      defaultValue: { email: "test@gmail.com" },
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
      className: "bg-red-100 w-full",
      placeholder: "Password",
      defaultValue: { password: "" },
    },
  ];

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <FormComponent
      gridTemplateAreas="'password password email email'  'reset submit submit submit'"
      gridTemplateColumns="1fr 1fr 1fr 1fr"
      resetButton={true}
      fields={fields}
      formSchema={formSchema}
      onSubmit={onSubmit}
    />
  );
};

export { TestForm };
