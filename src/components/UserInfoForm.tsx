import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  firstName: z.string().min(2, "Voornaam moet minimaal 2 karakters zijn"),
  lastName: z.string().min(2, "Achternaam moet minimaal 2 karakters zijn"),
  email: z.string().email("Voer een geldig e-mailadres in"),
  phoneNumber: z.string().min(10, "Voer een geldig telefoonnummer in"),
  parentName: z.string().optional(),
});

export type UserInfo = z.infer<typeof formSchema>;

interface UserInfoFormProps {
  onSubmit: (userInfo: UserInfo) => void;
}

const UserInfoForm = ({ onSubmit }: UserInfoFormProps) => {
  const form = useForm<UserInfo>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      parentName: "",
    },
  });

  const handleSubmit = (values: UserInfo) => {
    onSubmit(values);
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-foreground">
          Persoonlijke Informatie
        </CardTitle>
        <p className="text-muted-foreground">
          Vul je gegevens in om de quiz te starten
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voornaam *</FormLabel>
                    <FormControl>
                      <Input placeholder="Je voornaam" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Achternaam *</FormLabel>
                    <FormControl>
                      <Input placeholder="Je achternaam" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mailadres *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="je@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefoonnummer *</FormLabel>
                  <FormControl>
                    <Input placeholder="06 12345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ouder/Begeleider (optioneel)</FormLabel>
                  <FormControl>
                    <Input placeholder="Naam van ouder of begeleider" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Start Quiz
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserInfoForm;