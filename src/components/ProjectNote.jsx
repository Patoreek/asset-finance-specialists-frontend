import React from "react";

const ProjectNote = () => {
  return (
    <div className="p-6 border border-red-400 rounded-lg w-96 shadow-xl bg-red-100 text-center text-md text-red-900">
      <b className="text-xl font-semibold flex justify-center items-center">
        <span className="text-3xl mr-2">⚠️</span> Note:
      </b>
      <p className="mt-2 text-base">
        This is an open-source project designed to demonstrate web development
        skills.
      </p>
      <b className="mt-4 block text-lg text-red-700 font-bold">
        <span className="text-3xl mr-2">❗</span>Please make sure to use fake
        details for the signup and login. This is a demo project, and real data
        should NOT be used.
      </b>
    </div>
  );
};

export default ProjectNote;
