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
import BasicInfo from "./BasicInfo";
import  ProfessionalInfo  from "./ProfessionalInfo";
import  DocumentsInfo  from "./DocumentsInfo";

const ProfileForm = ({ register, watch, isEditing, role, handleFileChange }) => {
    return (
      <form className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="mb-6 grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <BasicInfo register={register} watch={watch} isEditing={isEditing} />
          </TabsContent>

          
          <TabsContent value="professional">
            <ProfessionalInfo register={register} watch={watch} isEditing={isEditing} role={role} />
          </TabsContent>
          
          <TabsContent value="documents">
            <DocumentsInfo register={register} watch={watch} isEditing={isEditing} role={role} handleFileChange={handleFileChange} />
          </TabsContent>
        </Tabs>
      </form>
    );
  };

export default ProfileForm;
