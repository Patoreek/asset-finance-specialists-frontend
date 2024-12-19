import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import apiClient from "../lib/apiClient";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Applications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  useEffect(() => {
    const fetchApplications = async () => {
      await getApplications();
    };
    fetchApplications();
  }, []);

  const getApplications = async () => {
    try {
      const response = await apiClient.get(`application/get`);
      setApplications(response.data.applications);
    } catch (error) {
      console.error("Axios error [application/get]:", error.message);
    }
  };

  const deleteApplicationHandler = async (appId) => {
    try {
      const response = await apiClient.delete(`application/delete/${appId}`);
      if (response.status === 200) {
        toast.success("Application deleted");
        setApplications((prevApplications) =>
          prevApplications.filter((app) => app._id !== appId)
        );
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const createNewHandler = (e, id) => {
    navigate("/application/new");
  };
  return (
    <div className="max-w-7xl w-full mx-auto py-10 px-2">
      <Toaster richColors />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Applications</h1>
        <Button
          className=" bg-blue-500 hover:bg-blue-600"
          onClick={createNewHandler}
        >
          Create New
        </Button>
      </div>
      <div className="mt-10">
        {/* Table */}
        <Table>
          <TableCaption>A list of your finance applications.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Income</TableHead>
              <TableHead className="text-right">Expenses</TableHead>
              <TableHead className="text-right">Assets</TableHead>
              <TableHead className="text-right">Liabilities</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow
                key={app._id}
                onClick={() => navigate(`/application/${app._id}`)}
              >
                <TableCell className="font-semibold">{app.name}</TableCell>
                <TableCell>
                  AUD ${Number(app.income).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  AUD ${Number(app.expenses).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  AUD ${Number(app.assets).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  AUD ${Number(app.liabilities).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <div
                    className="flex justify-end"
                    onClick={(e) => e.stopPropagation()} // Prevent triggering the row click from any actions in this cell
                  >
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          className="bg-red-500 hover:bg-red-600"
                          onClick={(e) => e.stopPropagation()} // Prevent row navigation
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent
                        onClick={(e) => e.stopPropagation()} // Prevent row navigation when interacting with the dialog
                      >
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to delete this application?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your application
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row navigation
                              deleteApplicationHandler(app._id);
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Applications;
