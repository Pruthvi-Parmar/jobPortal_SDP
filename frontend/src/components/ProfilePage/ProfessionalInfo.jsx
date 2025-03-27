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
const ProfessionalInfo = ({ register, watch, isEditing, role }) => {
  //console.log("Role:", role); // Log role
  //console.log("Company Data:", watch("company")); // Log company data

  return (
    <div className="space-y-8">
      {role === "jobseeker" && (
        <>
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-500" /> Qualifications
            </h3>
            <Separator />
            {watch("qualifications")?.map((qualification, index) => (
              <Card key={index} className="bg-slate-50 border-slate-200">
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`qualifications[${index}].education`} className="text-sm text-slate-500">
                      Education
                    </Label>
                    <Input
                      id={`qualifications[${index}].education`}
                      {...register(`qualifications[${index}].education`)}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-white" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`qualifications[${index}].skills`} className="text-sm text-slate-500">
                      Skills
                    </Label>
                    <Input
                      id={`qualifications[${index}].skills`}
                      {...register(`qualifications[${index}].skills`)}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-white" : ""}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-500" /> Experience
            </h3>
            <Separator />
            {watch("experience")?.map((exp, index) => (
              <Card key={index} className="bg-slate-50 border-slate-200">
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`experience[${index}].title`} className="text-sm text-slate-500">
                      Title
                    </Label>
                    <Input
                      id={`experience[${index}].title`}
                      {...register(`experience[${index}].title`)}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-white" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`experience[${index}].company`} className="text-sm text-slate-500">
                      Company
                    </Label>
                    <Input
                      id={`experience[${index}].company`}
                      {...register(`experience[${index}].company`)}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-white" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`experience[${index}].desc`} className="text-sm text-slate-500">
                      Description
                    </Label>
                    <Textarea
                      id={`experience[${index}].desc`}
                      {...register(`experience[${index}].desc`)}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-white min-h-[80px]" : "min-h-[80px]"}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
      {role === "recruiter" && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-500" /> Company
          </h3>
          <Separator />
          {/* Render at least one company field, even if empty */}
          {(watch("company")?.length > 0 ? watch("company") : [{}]).map((comp, index) => (
            <Card key={index} className="bg-slate-50 border-slate-200">
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`company[${index}].name`} className="text-sm text-slate-500">
                    Company Name
                  </Label>
                  <Input
                    id={`company[${index}].name`}
                    {...register(`company[${index}].name`)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-white" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`company[${index}].desc`} className="text-sm text-slate-500">
                    Description
                  </Label>
                  <Textarea
                    id={`company[${index}].desc`}
                    {...register(`company[${index}].desc`)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-white min-h-[80px]" : "min-h-[80px]"}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfessionalInfo;