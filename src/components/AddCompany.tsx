import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"
import z from "zod"
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { BarLoader } from "react-spinners";
import axios from "axios";
import { Company } from "@/types";

const schema = z.object({
    name: z.string().min(1, "Company name is required"),
    logo: typeof FileList !== "undefined"
  ? z
      .instanceof(FileList)
      .refine(
        (file) =>
          file.length > 0 &&
          ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml", "image/gif", "image/avif"].includes(file[0].type),
        {
          message: "Logo must be a PNG, JPEG, JPG, WEBP, SVG, GIF, or AVIF image",
        }
      )
  : z.any()
})

const AddCompany = ({ setCompanies, xlButton = false, setCompanyCode, loadingCreatedJob = false }: { setCompanies: React.Dispatch<React.SetStateAction<Company[]>>; xlButton?: boolean; setCompanyCode: React.Dispatch<React.SetStateAction<string>>; loadingCreatedJob?: boolean }) => {

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [open, setOpen] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(schema),
    });

    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("/api/companies/recruiter");
        if (response.status === 200) {
          setCompanies(response.data);
        } 
        if (setCompanyCode) {
            setCompanyCode("");
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred while fetching companies');
      } finally {
        setLoading(false);
      }
    }

    const onSubmit = (data: z.infer<typeof schema>) => {
        const addCompany = async () => {
            setLoading(true);
            setError(null);
            try {
                const formData = new FormData();
                formData.append("name", data.name);
                formData.append("logo", data.logo[0]);

                const response = await axios.post("/api/recruiter/company", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (response.status === 201) {
                    fetchCompanies();
                    setOpen(false);
                    reset();
                } else {
                    setError("Failed to add company. Please try again.");
                }
            } catch (error) {
                console.error('Error adding company:', error);
                setError(error instanceof Error ? error.message : 'An unexpected error occurred while adding the company');
            } finally {
                setLoading(false);
            }
        };

        addCompany();
    };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
            {!xlButton ? <Button type="button" disabled={loadingCreatedJob} className="max-sm:w-full bg-slate-700 hover:bg-slate-400/50" size={"sm"} variant={"secondary"}>Add Company</Button>
            : <Button variant={"blue"} size={"xl"}>Add Company</Button>}
        </DrawerTrigger>
        <DrawerContent className="bg-slate-800 mx-4">
            <DrawerHeader>
                <DrawerTitle>Add a New Company</DrawerTitle>
            </DrawerHeader>
            <form className="flex flex-col sm:flex-row justify-center items-center gap-4 p-4 pb-0">
                <Input placeholder="Company Name" {...register("name")} />
                <Input type="file" accept="image/*" {...register("logo")} />
                <Button type="button" disabled={loading} className="max-sm:w-full w-40 text-white bg-red-500 hover:bg-red-600/50" onClick={handleSubmit(onSubmit)}>Add Company</Button>
            </form>
            {errors.name && <p className="text-red-500 bg-slate-800 py-1 my-1 mx-4 rounded-sm px-4 text-sm">{errors.name.message}</p>}
            {typeof errors.logo?.message === "string" && <p className="text-red-500 my-1 mx-4 bg-slate-800 py-1 rounded-sm px-4 text-sm">{errors.logo.message}</p>}
            {error && <p className="text-red-500 bg-slate-800 py-1 my-1 mx-4 rounded-sm px-4 text-sm">{error}</p>}

            <DrawerFooter>
                <DrawerClose asChild>
                    <Button type="button" disabled={loading} onClick={() => reset()} className="bg-slate-900 text-white hover:bg-slate-900/50">Cancel</Button>
                </DrawerClose>
                {loading && <BarLoader color="#3b82f6" width={"100%"} />}
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
  )
}

export default AddCompany