import type { Address } from 'viem'
import { useQuery } from '@tanstack/react-query'

import { resolveEnsProfile } from '#/utils/ens'
import type { ENSProfile } from '#/types/requests'
import FollowButton from '#/components/follow-button'
import FollowListItemName from './follow-list-item-name'

export interface FollowListItemProps {
  className?: string
  address: Address
  ensProfile?: ENSProfile
  showFollowsYouBadges?: boolean
  showTags?: boolean
  tags: string[]
  isFollowers?: boolean
  canEditTags?: boolean
  isBlockedList?: boolean
  isBlockedBy?: boolean
}

const FollowListItem: React.FC<FollowListItemProps> = ({
  className = '',
  address,
  ensProfile,
  showFollowsYouBadges,
  showTags,
  tags,
  isFollowers,
  canEditTags,
  isBlockedList,
  isBlockedBy
}) => {
  const { data: fetchedEnsProfile, isLoading: isEnsProfileLoading } = useQuery({
    queryKey: ['ens metadata', address],
    queryFn: async () => await resolveEnsProfile(address)
  })

  const profileName = ensProfile ? ensProfile.name : fetchedEnsProfile?.name
  const profileAvatar = fetchedEnsProfile?.avatar
  // const profileName = ensProfile ? ensProfile.name : fetchedEnsProfile?.name
  // const profileAvatar = ensProfile ? ensProfile.avatar ? fetchedEnsProfile?.avatar

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Left section: Avatar, Name, and Tags */}
      <FollowListItemName
        address={address}
        avatarUrl={profileAvatar}
        name={profileName}
        showFollowsYouBadges={showFollowsYouBadges}
        showTags={showTags}
        tags={tags}
        isFollowers={isFollowers}
        canEditTags={canEditTags}
        isEnsProfileLoading={isEnsProfileLoading}
        isBlockedList={isBlockedList}
      />
      {/* Right section: Follow Button with consistent width */}
      <FollowButton isBlockedBy={isBlockedBy} address={address} />
    </div>
  )
}

export default FollowListItem
