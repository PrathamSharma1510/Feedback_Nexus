// 'use client'

// import React, { useState } from 'react';
// import axios, { AxiosError } from 'axios';
// import dayjs from 'dayjs';
// import { X } from 'lucide-react';
// import { Message } from '@/model/User';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from '@/components/ui/alert-dialog';
// import { Button } from './ui/button';
// import { useToast } from '@/components/ui/use-toast';

// type MessageCardProps = {
//   message: Message;
//   onMessageDelete: (messageId: string) => void;
// };
// interface ErrorResponse {
//     message: string;
//   }
//   interface Message {
//     _id: string;
//     // Add other properties of the message if needed
//   }
// export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
//   const { toast } = useToast();

//   const handleDeleteConfirm = async () => {
//     try {
//       const response = await axios.delete(`/api/delete-message/${message._id}`);
//       toast({
//         title: 'Success',
//         description: response.data.message,
//       });
//       onMessageDelete(message._id);
//     } catch (error) {
//       const axiosError = error as AxiosError<ErrorResponse>;
//       toast({
//         title: 'Error',
//         description: axiosError.response?.data?.message ?? 'Failed to delete message',
//       });
//     }
//   };

//   return (
//     <Card className="card-bordered">
//       <CardHeader>
//         <div className="flex justify-between items-center">
//           <CardTitle>{message.content}</CardTitle>
//           <AlertDialog>
//             <AlertDialogTrigger asChild>
//               <Button variant='destructive'>
//                 <X className="w-5 h-5" />
//               </Button>
//             </AlertDialogTrigger>
//             <AlertDialogContent>
//               <AlertDialogHeader>
//                 <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                 <AlertDialogDescription>
//                   This action cannot be undone. This will permanently delete
//                   this message.
//                 </AlertDialogDescription>
//               </AlertDialogHeader>
//               <AlertDialogFooter>
//                 <AlertDialogCancel>
//                   Cancel
//                 </AlertDialogCancel>
//                 <AlertDialogAction onClick={handleDeleteConfirm}>
//                   Continue
//                 </AlertDialogAction>
//               </AlertDialogFooter>
//             </AlertDialogContent>
//           </AlertDialog>
//         </div>
//         <div className="text-sm">
//           {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
//         </div>
//       </CardHeader>
//       <CardContent></CardContent>
//     </Card>
//   );
// }