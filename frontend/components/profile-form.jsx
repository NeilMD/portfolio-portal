/**
 * v0 by Vercel.
 * @see https://v0.dev/t/MeSpDnKyjpf
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function ProfileForm({ className, ...props }) {
  return (
    <div>
      <div className="pt-10 px-4 space-y-6 sm:px-6">
        <header className="space-y-2">
          <div className="flex text-left space-x-3">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Meadow Richardson</h1>
            </div>
          </div>
        </header>
        <div className="space-y-8">
          <Card>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="E.g. Jane Doe"
                  defaultValue="Meadow Richardson"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="E.g. jane@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Biography</Label>
                <Textarea
                  id="bio"
                  placeholder="Enter your bio"
                  className="mt-1"
                  style={{ minHeight: "100px" }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="pt-6">
          <Button className={"cursor-pointer"}>Save</Button>
        </div>
      </div>
    </div>
  );
}
