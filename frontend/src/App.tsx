import { useCallback, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./components/ui/form";
import "./index.css";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardFooter } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { ScrollArea } from "./components/ui/scroll-area";

import { Api } from "backend/index";
import { hc } from 'hono/client';


const formSchema = z.object({
  message: z.string().min(1, {
    message: "Message must be at least 1 characters.",
  }),
})


interface ChatMessage {
  role: string
  content: string
}


function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const client = hc<Api>('/')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  })

  const onSubmit = useCallback((values: z.infer<typeof formSchema>) => {
    setMessages(messages => messages.concat([{ role: "user", content: values.message }]));
    form.reset();

    client.api.chat.$post({
      json: { role: "user", content: values.message }
    })
      .then((res) => res.json())
      .then((res) => {
        setMessages(messages => messages.concat(res.messages));
      });
  }, [setMessages, form]);

  return (
    <div className="p-6 h-screen w-screen">
      <Card className="p-6 h-full w-full relative">
        <CardContent className="p-0 h-[calc(100%-60px)]">
          <ScrollArea className="h-full w-full space-y-4 pr-6 pb-6 m-0">
            {
              messages.map(message => (
                message.role == "assistant"
                  ? <div key={message.content} className="mt-2 flex flex-col flex-wrap gap-2 w-max max-w-[75%] min-w-0 break-all px-4 py-2 rounded-lg text-sm bg-muted">{message.content}</div>
                  : <div key={message.content} className="mt-2 flex flex-col flex-wrap gap-2 w-max max-w-[75%] min-w-0 break-all px-4 py-2 rounded-lg text-sm bg-primary text-primary-foreground ml-auto">{message.content}</div>
              ))
            }
          </ScrollArea>
        </CardContent>
        <CardFooter className="absolute bottom-0 left-0 w-full">
          <Form
            {...form}
          >
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => {
                  return (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Enter a message..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <Button type="submit" className="ml-2">Send</Button>
            </form>
          </Form>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;
