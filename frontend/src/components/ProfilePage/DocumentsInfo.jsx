import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, Mail, MapPin, Briefcase, GraduationCap, Building, FileText, ImageIcon, Edit, Save, X } from 'lucide-react';
const DocumentsInfo = ({ register, watch, isEditing, role, handleFileChange }) => {
  return (
    <div className="space-y-6">
      {role === "jobseeker" && (
        <div className="space-y-2">
          <Label htmlFor="resume" className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" /> Resume
          </Label>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <Input id="resume" {...register("resume")} disabled={!isEditing} className={!isEditing ? "bg-slate-50" : ""} />
            </div>
            <div className="flex gap-2">
              <a
                href={watch("resume")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100 transition-colors"
              >
                <FileText className="h-4 w-4" /> View Resume
              </a>
              {isEditing && (
                <div className="relative">
                  <Button type="button" variant="outline" size="sm" className="relative z-10">
                    Upload New
                  </Button>
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, "resume")}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="coverimage" className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-blue-500" /> Profile Image
        </Label>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <Input id="coverimage" {...register("coverimage")} disabled={!isEditing} className={!isEditing ? "bg-slate-50" : ""} />
          </div>
          <div className="flex gap-2 items-center">
            <div className="h-12 w-12 rounded-full overflow-hidden border border-slate-200">
              <img
                src={watch("coverimage") || "/placeholder.svg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <div className="relative">
                <Button type="button" variant="outline" size="sm" className="relative z-10">
                  Upload New
                </Button>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "coverimage")}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsInfo;