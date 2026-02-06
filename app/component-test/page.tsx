"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { TestAssignmentList } from "@/components/reports/TestAssignmentList"
import { TestAssignmentWithStatus } from "@/types/reports"
import { toast } from "sonner"
import { useState } from "react"

export default function ComponentTestPage() {
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null)

  // Sample test assignments for testing
  const sampleTestAssignments: TestAssignmentWithStatus[] = [
    {
      id: "1",
      testName: "Blood Group Test",
      assignedDate: new Date().toISOString(),
      reportStatus: "pending",
      reportTypeCode: "BLOOD_GROUP"
    },
    {
      id: "2",
      testName: "Complete Blood Count (CBC)",
      assignedDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      reportStatus: "in-progress",
      reportTypeCode: "CBC"
    },
    {
      id: "3",
      testName: "Lipid Profile",
      assignedDate: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
      reportStatus: "completed",
      reportTypeCode: "LIPID_PROFILE"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-semibold text-foreground">
              shadcn/ui Component Test
            </h1>
            <p className="text-lg text-muted-foreground">
              Testing all installed components
            </p>
          </div>

          {/* Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>Different button variants and sizes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </CardContent>
          </Card>

          {/* Form Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>Form Inputs</CardTitle>
              <CardDescription>Input fields with labels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" placeholder="John Doe" />
              </div>
            </CardContent>
          </Card>

          {/* Select */}
          <Card>
            <CardHeader>
              <CardTitle>Select Dropdown</CardTitle>
              <CardDescription>Dropdown selection component</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a title" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mr">Mr.</SelectItem>
                    <SelectItem value="mrs">Mrs.</SelectItem>
                    <SelectItem value="ms">Ms.</SelectItem>
                    <SelectItem value="dr">Dr.</SelectItem>
                    <SelectItem value="master">Master</SelectItem>
                    <SelectItem value="miss">Miss</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Radio Group */}
          <Card>
            <CardHeader>
              <CardTitle>Radio Group</CardTitle>
              <CardDescription>Radio button selection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Sex</Label>
                <RadioGroup defaultValue="male">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Dialog */}
          <Card>
            <CardHeader>
              <CardTitle>Dialog</CardTitle>
              <CardDescription>Modal dialog component</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Patient Registration</DialogTitle>
                    <DialogDescription>
                      This is a sample dialog that will be used for patient registration.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="dialog-name">Name</Label>
                      <Input id="dialog-name" placeholder="Enter name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dialog-mobile">Mobile Number</Label>
                      <Input id="dialog-mobile" placeholder="+91" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Submit</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Toast Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Toast Notifications</CardTitle>
              <CardDescription>Sonner toast notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => toast.success("Success! Operation completed.")}>
                  Success Toast
                </Button>
                <Button onClick={() => toast.error("Error! Something went wrong.")}>
                  Error Toast
                </Button>
                <Button onClick={() => toast.info("Info: Processing your request...")}>
                  Info Toast
                </Button>
                <Button onClick={() => toast.warning("Warning: Please check your input.")}>
                  Warning Toast
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Badge Component */}
          <Card>
            <CardHeader>
              <CardTitle>Badge Component</CardTitle>
              <CardDescription>Status badges with different variants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="info">Info</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Test Assignment List */}
          <Card>
            <CardHeader>
              <CardTitle>Test Assignment List</CardTitle>
              <CardDescription>
                List of test assignments with status indicators
                {selectedTestId && ` - Selected: ${selectedTestId}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TestAssignmentList
                testAssignments={sampleTestAssignments}
                selectedTestId={selectedTestId}
                onTestSelect={(id) => {
                  setSelectedTestId(id)
                  toast.info(`Selected test: ${sampleTestAssignments.find(t => t.id === id)?.testName}`)
                }}
              />
            </CardContent>
          </Card>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient Card 1</CardTitle>
                <CardDescription>John Doe</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Mobile: +91 9876543210
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Patient Card 2</CardTitle>
                <CardDescription>Jane Smith</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Mobile: +91 9876543211
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Patient Card 3</CardTitle>
                <CardDescription>Bob Johnson</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Mobile: +91 9876543212
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
