import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import apiClient from "../lib/apiClient";

import ProjectNote from "../components/ProjectNote";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

import { Link } from "react-router-dom";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";

const signupSchema = z
  .object({
    firstName: z
      .string({
        required_error: "First name is required",
      })
      .min(1, { message: "First name is required" }),

    lastName: z
      .string({
        required_error: "Last name is required",
      })
      .min(1, { message: "Last name is required" }),

    phone: z
      .string({
        required_error: "Phone number is required",
      })
      .regex(
        /^\+?(\d{1,4})?(\s|-)?\(?\d{1,4}\)?(\s|-)?\d{1,4}(\s|-)?\d{1,4}$/,
        {
          message: "Invalid phone number",
        }
      ),

    address: z
      .string({
        required_error: "Address is required",
      })
      .min(1, { message: "Address is required" }),

    email: z
      .string({
        required_error: "Email is required",
      })
      .email({ message: "Please enter a valid email address" }),

    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, { message: "Password must be at least 6 characters long" }),

    confirmPassword: z
      .string({
        required_error: "Confirm password is required",
      })
      .min(6, {
        message: "Confirm password must be at least 6 characters long",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignUp = () => {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const serverUrl = import.meta.env.VITE_SERVER_URL;
      const response = await apiClient.post(`auth/signup`, data);
      if (response.data.success) {
        toast({
          title: "Sign up successful! Redirecting to login.",
          variant: "success",
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 2500);
      }
    } catch (error) {
      console.error("Axios error:", error.message);
    }
  };

  return (
    <div className="flex gap-4 justify-center items-center h-full bg-slate-200">
      <ProjectNote />
      <div className="p-6 border rounded-lg shadow-md bg-white w-2/6">
        <Toaster />
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {Object.keys(form.formState.errors).length > 0 && (
          <div className="mb-4 p-3 border-l-4 border-red-500 bg-red-100 text-red-700 text-sm font-medium rounded">
            <ul>
              {Object.values(form.formState.errors).map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your address" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm your password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              Sign Up
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p>
            Already have an account?{" "}
            <Link to="/" className="text-blue-500 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
