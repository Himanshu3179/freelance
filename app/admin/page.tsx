"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Application {
  _id: string;
  jobId: string;
  name: string;
  email: string;
  proposal: string;
}

interface Job {
  _id: string;
  title: string;
  applications?: Application[];
}

export default function AdminPanel() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/jobs").then((res) => res.json()),
      fetch("/api/applications").then((res) => res.json()),
    ])
      .then(([jobsData, applicationsData]) => {
        setJobs(jobsData);
        setApplications(applicationsData);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const getJobApplications = (jobId: string) => {
    return applications.filter((app) => app.jobId === jobId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Job Applications</h2>
          <Accordion type="single" collapsible>
            {jobs.map((job) => (
              <AccordionItem key={job._id} value={job._id}>
                <AccordionTrigger className="text-lg">
                  {job.title}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {getJobApplications(job._id).map((application) => (
                      <Card key={application._id} className="p-4">
                        <div className="mb-2">
                          <span className="font-semibold">Applicant:</span>{" "}
                          {application.name}
                        </div>
                        <div className="mb-2">
                          <span className="font-semibold">Email:</span>{" "}
                          {application.email}
                        </div>
                        <div>
                          <span className="font-semibold">Proposal:</span>
                          <p className="mt-1 text-gray-600">
                            {application.proposal}
                          </p>
                        </div>
                      </Card>
                    ))}
                    {getJobApplications(job._id).length === 0 && (
                      <p className="text-gray-500">No applications yet</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </div>
    </div>
  );
}
