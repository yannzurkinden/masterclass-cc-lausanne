import { useState, useEffect, useCallback } from "react";
import { contacts as contactsApi, type Contact, type ContactInput } from "@/lib/api";
import { ContactsTable } from "@/components/contacts/ContactsTable";
import { ContactForm } from "@/components/contacts/ContactForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

export function ContactsPage() {
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchContacts = useCallback(async () => {
    try {
      const data = await contactsApi.list();
      setContactList(data);
    } catch (err) {
      console.error("Erreur chargement contacts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleCreate = async (data: ContactInput) => {
    await contactsApi.create(data);
    setShowForm(false);
    fetchContacts();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Chargement...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contacts</h1>
          <p className="text-muted-foreground">
            {contactList.length} contact{contactList.length > 1 ? "s" : ""} dans ton CRM
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Fermer
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un contact
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nouveau contact</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
            />
          </CardContent>
        </Card>
      )}

      <ContactsTable contacts={contactList} />
    </div>
  );
}
