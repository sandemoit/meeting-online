'use client'
import React, { use, useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation';
import MeetingModal from './MeetingModal';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useToast } from "@/hooks/use-toast"
import { Textarea } from './ui/textarea';
import ReactDatePicker from 'react-datepicker';
import { Input } from "@/components/ui/input"

const MeetingTypeList = () => {
    const router = useRouter();
    const [meetingState, setMeetingState] = useState<'isScheduledMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();
    const { user } = useUser();
    const client = useStreamVideoClient();
    const [values, setValues] = useState({
        dateTime: new Date(),
        description: '',
        link: '',
    });
    const [callDetails, setCallDetails] = useState<Call>();
    const { toast } = useToast()

    const createMeeting = async () => {
        if (!user || !client) return;

        try {
            if (!values.dateTime) {
                toast({ title: "Please select a date and time" })
                return;
            }

            const id = crypto.randomUUID();
            const call = client.call('default', id);

            if (!call) throw new Error('Failed to create call');

            const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
            const description = values.description || 'Instant meeting';

            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom: {
                        description
                    }
                }
            })

            setCallDetails(call);

            if (!values.description) {
                router.push(`/meeting/${call.id}`);
            }

            toast({ title: "Meeting Created" })
        } catch (error) {
            console.log(error)
            toast({ title: "Failed to create meeting" })
        }
    }

    const meetingLink = `${process.env.NEXT_PUBLIC_APP_URL}/meeting/${callDetails?.id}`

    return (
        <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
            <HomeCard
                img="/icons/add-meeting.svg"
                title="New Meeting"
                description="Start an instant meeting"
                handleClick={() => setMeetingState('isInstantMeeting')}
                className="bg-orange-1"
            />
            <HomeCard
                img="/icons/schedule.svg"
                title="Scheduled Meeting"
                description="Plan your meeting"
                handleClick={() => setMeetingState('isScheduledMeeting')}
                className="bg-blue-1"
            />
            <HomeCard
                img="/icons/recordings.svg"
                title="Recordings Meeting"
                description="Record your meeting"
                handleClick={() => router.push('/recordings')}
                className="bg-yellow-1"
            />
            <HomeCard
                img="/icons/join-meeting.svg"
                title="Join Meeting"
                description="Join an instant meeting"
                handleClick={() => setMeetingState('isJoiningMeeting')}
                className="bg-purple-1"
            />

            {!callDetails ? (
                <MeetingModal
                    isOpen={meetingState === 'isScheduledMeeting'}
                    onClose={() => setMeetingState(undefined)}
                    title="Create Meeting"
                    handleClick={createMeeting}
                >
                    <div className='flex flex-col gap-2.5'>
                        <label className='text-base text-normal leading-[22px] text-sky-2'>Add a description</label>
                        <Textarea className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0' onChange={(e) => { setValues({ ...values, description: e.target.value }) }} />
                    </div>
                    <div className='flex w-full flex-col gap-2.5'>
                        <label className='text-base text-normal leading-[22px] text-sky-2'>Select date and time</label>
                        <ReactDatePicker selected={values.dateTime} onChange={(date) => setValues({ ...values, dateTime: date! })} showTimeSelect timeFormat='HH:mm' timeIntervals={15} timeCaption='Time' dateFormat='d MMMM yyyy HH:mm' className='w-full rounded bg-dark-2 p-2 focus:outline-none' />
                    </div>
                </MeetingModal>
            ) : (
                <MeetingModal
                    isOpen={meetingState === 'isScheduledMeeting'}
                    onClose={() => setMeetingState(undefined)}
                    title="Create Meeting"
                    className="text-center"
                    handleClick={() => {
                        navigator.clipboard.writeText(meetingLink);
                        toast({ title: 'Link copied' })
                    }}
                    image="/icons/checked.svg"
                    buttonIcon='/icons/copy.svg'
                    buttonText='Copy Metting Link'
                />
            )}

            <MeetingModal
                isOpen={meetingState === 'isJoiningMeeting'}
                onClose={() => setMeetingState(undefined)}
                title="Type the link here"
                className="text-center"
                buttonText="Join Meeting"
                handleClick={() => router.push(values.link)}
            >
                <Input
                    placeholder="Meeting link"
                    onChange={(e) => setValues({ ...values, link: e.target.value })}
                    className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
            </MeetingModal>

            <MeetingModal
                isOpen={meetingState === 'isInstantMeeting'}
                onClose={() => setMeetingState(undefined)}
                title="Start an instant meeting"
                className="text-center"
                buttonText="Start Meeting"
                handleClick={createMeeting}
            />
        </section>
    )
}

export default MeetingTypeList