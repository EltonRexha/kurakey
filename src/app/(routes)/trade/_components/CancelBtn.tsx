import FillButton from '@/components/ui/common/FillButton'
import React from 'react'
import { cancelTrade } from '../../../../../libs/api/trade'
import { useMutation } from '@tanstack/react-query'
import { useToastContext } from '@/context/ToastContext'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const CancelBtn = ({ tradeId }: { tradeId: string }) => {

    const { addToast } = useToastContext();
    const router = useRouter();

    const cancelMutation = useMutation({
        mutationFn: cancelTrade,
        onSuccess: () => {
            router.replace("/")
        },
        onError: () => {
            addToast('Failed to cancel trade', 'error')
        }
    })

    if (cancelMutation.isPending) {
        return (
            <FillButton backgroundColor="bg-red-500 flex items-center justify-center" fullWidth disabled>
                <Loader2 className="animate-spin" />
            </FillButton>
        )
    }

    return (
        <FillButton backgroundColor="bg-red-500" fullWidth onClick={() => cancelMutation.mutate(tradeId)}>
            Cancel Trade
        </FillButton>
    )
}

export default CancelBtn
