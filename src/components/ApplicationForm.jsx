import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import apiClient from "../lib/apiClient";
import BackButton from "./BackButton";

const applicationSchema = z.object({
  applicationName: z
    .string({
      required_error: "Application name is required",
    })
    .min(1, { message: "Application name is required" }),

  income: z
    .number({
      invalid_type_error: "Income must be a number",
    })
    .positive({ message: "Income must be greater than 0" })
    .or(z.string().regex(/^\d+(\.\d+)?$/, { message: "Income must be valid" })),

  expenses: z
    .number({
      invalid_type_error: "Expenses must be a number",
    })
    .nonnegative({ message: "Expenses cannot be negative" })
    .or(
      z.string().regex(/^\d+(\.\d+)?$/, { message: "Expenses must be valid" })
    ),

  assets: z
    .number({
      invalid_type_error: "Assets must be a number",
    })
    .nonnegative({ message: "Assets cannot be negative" })
    .or(z.string().regex(/^\d+(\.\d+)?$/, { message: "Assets must be valid" })),

  liabilities: z
    .number({
      invalid_type_error: "Liabilities must be a number",
    })
    .nonnegative({ message: "Liabilities cannot be negative" })
    .or(
      z
        .string()
        .regex(/^\d+(\.\d+)?$/, { message: "Liabilities must be valid" })
    ),
});

const ApplicationForm = ({ id }) => {
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    setEdit(id !== "new");
    if (id === "new") return;
    const fetchApplicationData = async () => {
      await getApplicationData();
    };
    fetchApplicationData();
  }, [id]);

  const form = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      id: null,
      applicationName: "",
      income: "",
      expenses: "",
      assets: "",
      liabilities: "",
    },
  });

  const getApplicationData = async () => {
    try {
      const response = await apiClient.get(`application/get/${id}`);

      if (!response?.data?.application?._id) {
        throw new Error("Application ID is missing in the response");
      }

      const applicationData = response.data.application;
      form.setValue("id", applicationData._id);
      form.setValue("applicationName", applicationData.name);
      form.setValue("income", applicationData.income);
      form.setValue("expenses", applicationData.expenses);
      form.setValue("assets", applicationData.assets);
      form.setValue("liabilities", applicationData.liabilities);
      setUserData(applicationData.user);
    } catch (error) {
      console.error("Axios error [application/get]:", error.message);
      let toastTitle = "An unexpected error occurred.";
      if (error.response) {
        const { status } = error.response;
        if (status === 400) {
          toastTitle = `Invalid application ID: ${id}. Returning to applications list.`;
        } else if (status === 404) {
          toastTitle = `Application with ID ${id} not found. Returning to applications list.`;
        }
      }

      toast({
        title: toastTitle,
        variant: "error",
        duration: 3000,
      });

      setTimeout(() => {
        navigate("/applications");
      }, 3000);
    }
  };

  const updateApplication = async (data) => {
    try {
      const response = await apiClient.put(`application/update/${id}`, data);
      if (!response?.data?.application?._id)
        throw new Error("Application ID is missing in the response");

      toast.success("Application Updated");
    } catch (error) {
      console.error("Axios error [application/create]:", error.message);
    }
  };

  const createApplication = async (data) => {
    try {
      const response = await apiClient.post(`application/create`, data);
      if (!response?.data?.application?._id)
        throw new Error("Application ID is missing in the response");

      const applicationId = response.data.application._id;
      toast.success("Application Created");
      setEdit(true);
      navigate(`/application/${applicationId}`);
    } catch (error) {
      console.error("Axios error [application/create]:", error.message);
    }
  };
  const onSubmit = async (data) => {
    if (!edit) {
      createApplication(data);
    } else {
      updateApplication(data);
    }
  };

  return (
    <div>
      <div className="flex justify-start w-4/5 py-2">
        <BackButton to={"/applications"} />
      </div>
      <div className="flex w-4/5">
        <div className="flex gap-4 w-full">
          {userData && (
            <div className="w-full h-full p-8 mb-6 border rounded-lg shadow-lg bg-white">
              <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                User Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-gray-700">
                  <span className="font-medium">First Name:</span>
                  <span className="text-gray-500">
                    {userData.firstName} {userData.lastName}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span className="font-medium">Address:</span>
                  <span className="text-gray-500">{userData.address}</span>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span className="font-medium">Phone:</span>
                  <span className="text-gray-500">{userData.phone}</span>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span className="font-medium">Email:</span>
                  <span className="text-gray-500">{userData.email}</span>
                </div>
              </div>
            </div>
          )}
          <div
            className={`p-6 border rounded-lg shadow-md bg-white ${
              edit ? "w-full" : "w-1/2 mx-auto"
            } h-full`}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">
              {edit ? "Update " : "Create New "}Application
            </h2>
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
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="applicationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter application name"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="income"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Income ($AUD)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="Enter income"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expenses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expenses ($AUD)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="Enter expenses"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assets ($AUD)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="Enter assets"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="liabilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Liabilities ($AUD)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="Enter liabilities"
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
                  {edit ? "Update" : "Submit"} Application
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
};

export default ApplicationForm;
