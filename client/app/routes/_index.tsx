import { useState } from "react";
import { useContract } from "../hooks/useContract";

import {
  Loader2,
  UserPlus,
  Trash2,
  Users,
  User,
  Info,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/accordion";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "../components/ui/tooltip";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";

export default function Index() {
  const {
    address,
    person,
    allPeople,
    loading,
    addOrUpdatePerson,
    getMyPerson,
    getAllPeople,
    deletePerson,
    getPerson,
  } = useContract();

  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">(0);
  const [selectedPerson, setSelectedPerson] = useState<{ name: string; age: number } | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleAddOrUpdate = async () => {
    if (name && age !== "") {
      await addOrUpdatePerson(name, age);
      setName("");
      setAge(0);
    }
  };

  const getContractPerson = async (personAddress: string) => {
    const personData = await getPerson(personAddress);
    if (personData) setSelectedPerson(personData);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <h1 className="text-3xl font-bold text-center text-primary">Welcome, {address}</h1>

      {/* Tabs for Navigation */}
      <Tabs defaultValue="add-update" className="w-full">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="add-update">Add/Update</TabsTrigger>
          <TabsTrigger value="my-info">My Info</TabsTrigger>
          <TabsTrigger value="all-people">All People</TabsTrigger>
          <TabsTrigger value="delete">Delete</TabsTrigger>
        </TabsList>

        {/* Add/Update Tab */}
        <TabsContent value="add-update">
          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <UserPlus className="w-5 h-5" /> Add or Update Your Info
              </h2>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Age</Label>
                <Input
                  type="number"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                />
              </div>
              <Button onClick={handleAddOrUpdate} disabled={loading} className="w-full">
                {loading ? <Loader2 className="animate-spin" /> : "Add/Update Info"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Info Tab */}
        <TabsContent value="my-info">
          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <User className="w-5 h-5" /> Your Info
              </h2>
              {person ? (
                <div>
                  <p><strong>Name:</strong> {person.name}</p>
                  <p><strong>Age:</strong> {person.age}</p>
                </div>
              ) : (
                <p>No info found. Please add your details.</p>
              )}
              <Button onClick={getMyPerson} disabled={loading} className="w-full">
                {loading ? <Loader2 className="animate-spin" /> : "Get My Info"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* All People Tab */}
        <TabsContent value="all-people">
          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Users className="w-5 h-5" /> All People
              </h2>
              <Button onClick={getAllPeople} disabled={loading} className="w-full">
                {loading ? <Loader2 className="animate-spin" /> : "Get All People"}
              </Button>
              <Accordion type="single" collapsible className="w-full">
                {allPeople.map((personAddress, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>
                      Person {index + 1} - {personAddress.slice(0, 6)}...{personAddress.slice(-4)}
                    </AccordionTrigger>
                    <AccordionContent>
                      <Button
                        variant="outline"
                        onClick={() => getContractPerson(personAddress)}
                        className="w-full text-left"
                      >
                        View Details
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              {selectedPerson && (
                <div className="pt-4 border-t">
                  <h3 className="font-semibold">Selected Person Info</h3>
                  <p><strong>Name:</strong> {selectedPerson.name}</p>
                  <p><strong>Age:</strong> {selectedPerson.age}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delete Tab */}
        <TabsContent value="delete">
          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Trash2 className="w-5 h-5" /> Delete My Info
              </h2>
              <p className="text-sm text-muted-foreground">
                Deleting your info will remove it permanently from the blockchain.
              </p>
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    Delete My Info
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. Your info will be permanently removed.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => setShowDeleteDialog(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={deletePerson}>
                      Confirm Delete
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tooltip Example */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="w-5 h-5 cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent>
            <p>This app uses blockchain to store and manage user data securely.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}