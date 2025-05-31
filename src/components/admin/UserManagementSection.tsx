
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, ShieldAlert, Loader2, UserCheck, UserX, UserPlus, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { listAllUsers, setUserAdminRole, toggleUserDisabledStatus, deleteFirebaseUser, type AdminUserRepresentation } from '@/app/admin/user-actions';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 10;

export function UserManagementSection() {
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUserRepresentation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState<{[key: string]: boolean}>({});
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);
  const [currentPageToken, setCurrentPageToken] = useState<string | undefined>(undefined); // Track current page for "previous"

  const fetchUsers = useCallback(async (pageToken?: string) => {
    setIsLoading(true);
    const result = await listAllUsers(ITEMS_PER_PAGE, pageToken);
    if (result.error) {
      toast({ variant: "destructive", title: "Fout bij ophalen gebruikers", description: result.error });
      setUsers([]);
    } else {
      setUsers(result.users);
      setNextPageToken(result.nextPageToken);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchUsers(currentPageToken);
  }, [fetchUsers, currentPageToken]);

  const handleAction = async (
    actionFunction: () => Promise<{ success: boolean; error?: string }>,
    actionKey: string,
    successMessage: string
  ) => {
    setIsSubmitting(prev => ({ ...prev, [actionKey]: true }));
    const result = await actionFunction();
    if (result.success) {
      toast({ title: "Succes", description: successMessage });
      fetchUsers(currentPageToken); // Refresh list
    } else {
      toast({ variant: "destructive", title: "Fout", description: result.error });
    }
    setIsSubmitting(prev => ({ ...prev, [actionKey]: false }));
  };

  const handleSetAdmin = (uid: string, isAdmin: boolean) => {
    handleAction(
      () => setUserAdminRole(uid, isAdmin),
      `admin-${uid}`,
      `Admin status voor gebruiker ${uid} ${isAdmin ? 'toegekend' : 'ingetrokken'}.`
    );
  };

  const handleToggleDisabled = (uid: string, isDisabled: boolean) => {
    handleAction(
      () => toggleUserDisabledStatus(uid, isDisabled),
      `disable-${uid}`,
      `Gebruiker ${uid} ${isDisabled ? 'uitgeschakeld' : 'ingeschakeld'}.`
    );
  };

  const handleDeleteUser = (uid: string) => {
    handleAction(
      () => deleteFirebaseUser(uid),
      `delete-${uid}`,
      `Gebruiker ${uid} verwijderd.`
    );
  };
  
  const formatDateSafe = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd-MM-yyyy HH:mm', { locale: nl });
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Gebruikersbeheer (Firebase Admin)</CardTitle>
        <CardDescription>Beheer gebruikersaccounts, rollen en status.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-between items-center">
           <Button onClick={() => toast({title: "Info", description: "Nieuwe gebruiker aanmaken via Firebase Console."})} variant="outline">
            <UserPlus className="mr-2 h-4 w-4" /> Nieuwe Gebruiker (via Console)
          </Button>
          <Button onClick={() => fetchUsers(currentPageToken)} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} /> Vernieuwen
          </Button>
        </div>

        {isLoading && users.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2 text-muted-foreground">Gebruikers laden...</p>
          </div>
        ) : users.length === 0 && !isLoading ? (
           <div className="text-center py-10">
            <AlertTriangle className="mx-auto h-12 w-12 text-primary/70" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">Geen gebruikers gevonden.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[25%]">E-mail</TableHead>
                  <TableHead className="w-[20%]">Naam</TableHead>
                  <TableHead className="w-[15%]">Admin Rol</TableHead>
                  <TableHead className="w-[15%]">Actief</TableHead>
                  <TableHead className="w-[15%]">Laatst ingelogd</TableHead>
                  <TableHead className="text-center w-[10%]">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell className="font-medium">{user.email || 'N/A'}</TableCell>
                    <TableCell>{user.displayName || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`admin-${user.uid}`}
                          checked={user.isAdmin}
                          onCheckedChange={(checked) => handleSetAdmin(user.uid, checked)}
                          disabled={isSubmitting[`admin-${user.uid}`] || isSubmitting[`disable-${user.uid}`] || isSubmitting[`delete-${user.uid}`]}
                        />
                        <Label htmlFor={`admin-${user.uid}`} className={cn(user.isAdmin ? "text-green-600" : "text-muted-foreground")}>
                           {isSubmitting[`admin-${user.uid}`] ? <Loader2 className="h-4 w-4 animate-spin" /> : (user.isAdmin ? 'Ja' : 'Nee')}
                        </Label>
                      </div>
                    </TableCell>
                     <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`disable-${user.uid}`}
                          checked={!user.disabled}
                          onCheckedChange={(checked) => handleToggleDisabled(user.uid, !checked)}
                          disabled={isSubmitting[`admin-${user.uid}`] || isSubmitting[`disable-${user.uid}`] || isSubmitting[`delete-${user.uid}`]}
                          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                        />
                         <Label htmlFor={`disable-${user.uid}`} className={cn(!user.disabled ? "text-green-600" : "text-red-600")}>
                            {isSubmitting[`disable-${user.uid}`] ? <Loader2 className="h-4 w-4 animate-spin" /> : (!user.disabled ? 'Actief' : 'Inactief')}
                        </Label>
                      </div>
                    </TableCell>
                     <TableCell className="text-xs text-muted-foreground">{formatDateSafe(user.lastSignInTime)}</TableCell>
                    <TableCell className="text-center">
                       <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" disabled={isSubmitting[`delete-${user.uid}`]}>
                             {isSubmitting[`delete-${user.uid}`] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Gebruiker Verwijderen?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Weet u zeker dat u gebruiker {user.email || user.uid} wilt verwijderen? Dit kan niet ongedaan gemaakt worden.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuleren</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.uid)}
                              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            >
                              Ja, Verwijder Gebruiker
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
         <div className="mt-6 flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
                // Voor 'vorige' is een meer complexe state nodig om vorige pageTokens bij te houden.
                // Voor nu resetten we of gaan we naar de start als er geen logica is.
                toast({title: "Info", description: "Vorige pagina functionaliteit nog niet volledig geïmplementeerd."})
                setCurrentPageToken(undefined);
                // fetchUsers(undefined); // Om naar de eerste pagina te gaan
            }}
            disabled={!currentPageToken || isLoading} 
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Vorige
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
                setCurrentPageToken(nextPageToken);
                fetchUsers(nextPageToken);
            }}
            disabled={!nextPageToken || isLoading}
          >
            Volgende
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Gebruikers worden beheerd via de Firebase Admin SDK. Wijzigingen zijn direct van kracht.
        </p>
      </CardFooter>
    </Card>
  );
}
