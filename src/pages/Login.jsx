import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import apiClient from "../lib/apiClient";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import ProjectNote from "../components/ProjectNote";

const loginSchema = z.object({
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
});

const LoginForm = () => {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await apiClient.post(`auth/login`, data);
      if (response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        window.location.href = "/applications";
      }
    } catch (error) {
      console.error("Axios error:", error.message);
    }
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center h-full bg-slate-200">
      <ProjectNote />
      <div className="p-6 border rounded-lg shadow-md bg-white w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

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

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              Log In
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
