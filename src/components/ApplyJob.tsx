import { Job } from "@/types";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface ApplyJobProps {
    job: Job | null;
    user: any;
    applied?: any;
}


const ApplyJob = ({job, user, applied=false}: ApplyJobProps) => {

    console.log("ApplyJob component", job, user, applied);
  return (
    <Drawer open={applied ? false : undefined}>
        <DrawerTrigger asChild>
            <Button size={"lg"}  variant={job?.isOpen && applied ? "blue" : "destructive"} disabled={!job?.isOpen || applied}>
                {job?.isOpen ? (applied ? "Applied" : "Apply Now") : "Job Closed"}
            </Button>
        </DrawerTrigger>
        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>
                    Apply for {job?.title} at {job?.company?.name}
                </DrawerTitle>
                <DrawerDescription></DrawerDescription>
            </DrawerHeader>

            <form className="flex flex-col gap-4 p-4 pb-0">
                <Input
                    type="text"
                    placeholder="Full Name"
                    className="flex-1"
                    defaultValue={user?.fullName || ""}
                />
                <Input
                    type="email"
                    placeholder="Email"
                    className="flex-1"
                    defaultValue={user?.emailAddresses[0]?.emailAddress || ""}
                />
                <Input
                    type="text"
                    placeholder="Phone Number"
                    className="flex-1"
                />
                <Input
                    type="number"
                    placeholder="Years of Experience"
                    className="flex-1"
                />
                <Input
                    type="text"
                    placeholder="Skills (Comma separated)"
                    className="flex-1"
                />
                <RadioGroup defaultValue="">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Intermediate" id="intermediate" />
                        <label htmlFor="intermediate">Intermediate</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Graduate" id="graduate" />
                        <label htmlFor="graduate">Graduate</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Post Graduate" id="post-graduate" />
                        <label htmlFor="post-graduate">Post Graduate</label>
                    </div>
                </RadioGroup>
                <Input
                    type="file"
                    accept=".pdf, .doc, .docx"
                    className="flex-1 file:text-gray-500 file:pr-4"
                />
                <Button type="submit" variant={"blue"} size={"lg"}>
                    Apply
                </Button>
            </form>
            <DrawerFooter>
                <DrawerClose asChild>
                    <Button variant={"outline"}>Cancel</Button>
                </DrawerClose>
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
  )
}

export default ApplyJob