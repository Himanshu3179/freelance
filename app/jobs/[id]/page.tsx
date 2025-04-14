"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface Job {
  _id: string;
  title: string;
  description: string;
  category: string;
}

export default function JobDetail() {
  const params = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    proposal: "",
  });

  const router = useRouter();

  useEffect(() => {
    fetch(`/api/jobs/${params.id}`)
      .then((res) => res.json())
      .then((data) => setJob(data))
      .catch((err) => console.error("Error fetching job:", err));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          jobId: params.id,
        }),
      });

      if (response.ok) {
        alert("Application submitted successfully!");
        setFormData({ name: "", email: "", proposal: "" });
        router.push("/");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };

  if (!job) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="p-8 mb-8">
          <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
            {job.category}
          </span>
          <p className="mt-4 text-gray-600">{job.description}</p>
        </Card>

        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Apply for this Job</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <Input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Proposal
              </label>
              <Textarea
                required
                value={formData.proposal}
                onChange={(e) =>
                  setFormData({ ...formData, proposal: e.target.value })
                }
                className="rounded-lg"
                rows={6}
              />
            </div>
            <Button type="submit" className="w-full">
              Submit Application
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
