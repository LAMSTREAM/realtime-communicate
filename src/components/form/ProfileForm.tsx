'use client'

import {ImagePlus} from "lucide-react";
import {useForm} from "react-hook-form";
import {useUser} from "@auth0/nextjs-auth0/client";
import {usePathname, useRouter} from "next/navigation";
import {useEffect, useState, ChangeEvent, useId, useCallback} from "react";

import {cn, delay, getUserImageSource} from "@/lib/utils";
import {uploadProfileImage} from "@/app/api/file/profileImage";
import {getProfileDataBySub, setProfileDataBySub} from "@/app/api/form/profile";
import {Button} from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useStateModal} from "@/components/provider/state-modal";

type Profile = z.infer<typeof profile>;
const profile = z.object({
  name: z.string().min(2).max(15),
  uid: z.string().min(5).max(10),
  image: z.string().optional(),
  bio: z.string().max(150),
});
const defaultProfile = {
  name: "",
  uid: "",
  image: "",
  bio: "",
}

export default function ProfileForm({
  className,
  open, // detect used by client component
}: {
  className?: string,
  open?: boolean,
}) {
  const path = usePathname()
  const router = useRouter()
  const {user: remoteUser} = useUser()
  const [file, setFile] = useState<File>()
  const imageInputId = useId()
  // Universal modal
  const {modalData: formState, setModal} = useStateModal()

  const form = useForm<Profile>({
    resolver: zodResolver(profile),
    defaultValues: defaultProfile,
  })

  const fetchProfile = useCallback(async () => {
    if(!remoteUser)return;
    const user = await getProfileDataBySub(remoteUser?.sub!)
    form.reset(
      {
        name: user?.name || "",
        uid: user?.uid || "",
        image: user?.image || "",
        bio: user?.bio || "",
      },
    )
  }, [form, remoteUser])

  //initial profile
  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const onSubmit = useCallback((values: Profile)=>{
    async function submit() {
      setModal({state: 'Loading', desc: 'Submitting'})

      const sProfile = {...values}
      if (values.image) {
        const base64Image = values.image.split(',')[1]
        const result = await uploadProfileImage(base64Image)
        if (result) sProfile.image = result
      }
      //@ts-ignore
      const result = await setProfileDataBySub(remoteUser?.sub, sProfile)
      if(result.status === 'fail'){
        setModal({state: 'Failed', desc: result.payload})
        await delay(1200)
        setModal({state: '', desc: ''})
        return
      }

      //Indicate if success
      setModal({state: 'Succeed', desc: 'Succeed'})
      await delay(600)
      //If first time edit, push back
      if(path?.endsWith('/about/edit-profile'))router.back()
      //If edit on a drawer / dialog, refresh the page
      if(open !== undefined)location.reload()
    }
    submit()
  }, [remoteUser, open, path, router, setModal])

  const handleImage = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const _files = e.target.files
    if (!_files || _files.length < 1)return;
    const _file = _files[0];
    if(!_file.type.includes(`image`)) {
      setModal({state: 'Failed', desc: 'You should upload an image!'})
      await delay(1200)
      setModal({state: '', desc: ''})
      return;
    }
    if(_file.size/(1024*1024) > 2){
      setModal({state: 'Failed', desc: 'Image should not be larger than 2 MB'})
      await delay(1200)
      setModal({state: '', desc: ''})
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = async (event) => {
      const imageDataUrl = event.target?.result?.toString() || "";
      form.setValue("image", imageDataUrl)
      console.log(imageDataUrl)
      setFile(_file);
    }
    fileReader.readAsDataURL(_file);
  }, [form, setModal])

  return (
    <div className={cn(`p-3`, className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 md:space-y-3">
          <FormField
            control={form.control}
            name="image"
            render={({field: {onChange, value, ...rest}}) => (
              <FormItem>
                <Avatar
                  className={`group m-auto select-none w-36 h-36 cursor-pointer`}
                  onClick={() => {document.getElementById(imageInputId)!.click()}}
                >
                  <AvatarImage src={getUserImageSource(form.getValues("image"))}
                    className={`group-hover:blur transition-all duration-250`}
                  />
                  <AvatarFallback>N/A</AvatarFallback>
                  <ImagePlus className={`hidden group-hover:block transition-all duration-250 text-white w-12 h-12 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}/>
                </Avatar>
                <FormControl>
                  <Input
                    {...rest}
                    type="file"
                    accept={`image/*`}
                    id={imageInputId}
                    className={`hidden`}
                    onChange={handleImage}
                    disabled={formState.state !== ""}
                    aria-disabled={formState.state !== ""}
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({field}) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={formState.state !== ""}
                    aria-disabled={formState.state !== ""}/>
                </FormControl>
                <FormDescription>
                  Your in-app display name.
                </FormDescription>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="uid"
            render={({field}) => (
              <FormItem>
                <FormLabel>UID</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={formState.state !== ""}
                    aria-disabled={formState.state !== ""}/>
                </FormControl>
                <FormDescription>
                  Your in-app Unique ID.
                </FormDescription>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({field}) => (
              <FormItem>
                <FormLabel>Biography</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className={`max-h-20 resize-none no-scrollbar`}
                    disabled={formState.state !== ""}
                    aria-disabled={formState.state !== ""}/>
                </FormControl>
                <FormDescription>
                  Your in-app Biography.
                </FormDescription>
                <FormMessage/>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant={"outline"}
            className={`mx-auto w-full`}
            disabled={formState.state !== ""}
            aria-disabled={formState.state !== ""}
          >Submit</Button>
        </form>
      </Form>
    </div>
  )
}