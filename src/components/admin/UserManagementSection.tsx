
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, Edit, Trash2, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const dummyUsers = [
  { id: 'user1', email: 'gebruiker1@voorbeeld.nl', uid: 'uid123xyz', role: 'Gebruiker' },
  { id: 'user2', email: 'admin@frissestart.nl', uid: 'uid789abc', role: 'Admin' },
  { id: 'user3', email: 'cursist@test.com', uid: 'uid456def', role: 'Cursist' },
];

export function UserManagementSection() {
  const { toast } = useToast();

  const handleAddNewUser = () => {
    toast({ title: "Info", description: "Functionaliteit 'Nieuwe Gebruiker Toevoegen' is nog niet geïmplementeerd via deze interface. Gebruik Firebase Authentication Console." });
  };

  const handleEditUser = (userId: string) => {
    toast({ title: "Info", description: `Functionaliteit 'Bewerk Gebruiker ${userId}' is nog niet geïmplementeerd.` });
  };

  const handleDeleteUser = (userId: string) => {
    toast({ title: "Info", description: `Functionaliteit 'Verwijder Gebruiker ${userId}' is nog niet geïmplementeerd.` });
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>Gebruikersbeheer</CardTitle>
          <CardDescription>Beheer gebruikersaccounts en rollen (momenteel placeholder).</CardDescription>
        </div>
         <Button onClick={handleAddNewUser} variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
          <UserPlus className="mr-2 h-4 w-4" /> Nieuwe Gebruiker
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-md text-yellow-700 flex items-start">
          <ShieldAlert className="h-5 w-5 mr-3 mt-1 shrink-0" />
          <div>
            <h4 className="font-semibold">Beperkte Functionaliteit</h4>
            <p className="text-sm">
              Volledig gebruikersbeheer, inclusief het toewijzen van rollen (zoals admin) en het beheren van wachtwoorden,
              vereist Firebase Admin SDK-rechten. Deze operaties dienen veilig via een backend of de Firebase Console te worden uitgevoerd.
              Deze sectie is een placeholder om de structuur te tonen.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>UID (Firebase)</TableHead>
                  <TableHead>Rol (Voorbeeld)</TableHead>
                  <TableHead className="text-center">Acties (Voorbeeld)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{user.uid}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" onClick={() => handleEditUser(user.id)} className="mr-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)} className="text-destructive hover:text-destructive/80">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </div>
      </CardContent>
       <CardFooter>
        <p className="text-xs text-muted-foreground">
          Gebruik de Firebase Console voor daadwerkelijk gebruikersbeheer.
        </p>
      </CardFooter>
    </Card>
  );
}
