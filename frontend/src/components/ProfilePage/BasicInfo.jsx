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

const BasicInfo = ({ register, watch, isEditing }) => {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-500" /> Username
            </Label>
            <Input id="username" {...register("username")} disabled={!isEditing} className={!isEditing ? "bg-slate-50" : ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-500" /> Email
            </Label>
            <Input id="email" {...register("email")} disabled={!isEditing} className={!isEditing ? "bg-slate-50" : ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullname" className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-500" /> Full Name
            </Label>
            <Input id="fullname" {...register("fullname")} disabled={!isEditing} className={!isEditing ? "bg-slate-50" : ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" /> Location
            </Label>
            <Input id="location" {...register("location")} disabled={!isEditing} className={!isEditing ? "bg-slate-50" : ""} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="bio" className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-500" /> Bio
            </Label>
            <Textarea id="bio" {...register("bio")} disabled={!isEditing} className={!isEditing ? "bg-slate-50 min-h-[100px]" : "min-h-[100px]"} />
          </div>
        </div>
      </div>
    );
  };
  
  export default BasicInfo;