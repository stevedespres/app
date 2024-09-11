import Link from 'next/link'
import type { Address } from 'viem'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { isValidEnsName } from '#/utils/ens'
import { Avatar } from '#/components/avatar'
import { formatNumber } from '#/utils/formatNumber'
import { cn, truncateAddress } from '#/lib/utilities'
import FollowButton from '#/components/follow-button'
import type { LeaderboardFilter } from '#/types/common'
import useFollowerState from '#/hooks/use-follower-state'

interface TableRowProps {
  address: Address
  name: string | null
  avatar: string | null
  rank: number
  following?: number
  followers?: number
  mutuals?: number
  top8?: number
  blocked?: number
  firstStat?: LeaderboardFilter
}

const TableRow: React.FC<TableRowProps> = ({
  address,
  name,
  avatar,
  rank,
  following,
  followers,
  mutuals,
  top8,
  blocked,
  firstStat
}) => {
  const rankedAs = rank <= 3 ? 'top-three' : rank <= 10 ? 'top-ten' : 'regular'
  const rankNumber = {
    'top-three': (
      <p
        className={`text-2xl xxs:text-3xl sm:text-4xl md:text-5xl ${
          {
            1: 'first-place',
            2: 'second-place',
            3: 'third-place'
          }[rank]
        }
        `}
      >
        {rank}
      </p>
    ),
    'top-ten': (
      <p className='text-2xl xxs:text-3xl sm:text-4xl md:text-5xl font-bold w-min mx-auto'>
        {rank}
      </p>
    ),
    regular: (
      <p
        className={`text ${
          rank >= 10000
            ? 'text-xs xxs:text-sm sm:text-lg'
            : rank >= 1000
              ? 'text-sm xxs:text-base sm:text-xl'
              : 'xxs:text-xl sm:text-2xl'
        } font-bold w-min mx-auto`}
      >
        {formatNumber(rank)}
      </p>
    )
  }[rankedAs]

  // const { data: fetchedEnsProfile } = useQuery({
  //   queryKey: ['ens metadata', address],
  //   queryFn: async () => await resolveEnsProfile(address)
  // })

  const router = useRouter()
  const pathname = usePathname()
  const { t } = useTranslation()
  const { followerTag } = useFollowerState({ address })

  const isHome = pathname === '/'
  // const name = fetchedEnsProfile?.name
  // const avatarUrl = fetchedEnsProfile?.avatar

  return (
    <div className='flex flex-col'>
      <div className='flex items-center w-full gap-4 p-2 sm:p-4 hover:bg-darkGrey/5 dark:hover:bg-darkGrey/40 rounded-xl sm:gap-6 md:gap-8 h-[75px]'>
        <div className='tabular-nums min-w-4 w-4 xxs:min-w-6 xxs:w-6 sm:w-10 flex justify-center text-right'>
          {rankNumber}
        </div>
        <div
          className={`flex gap-2 items-center w-[51%] 3xs:w-[54%] xxs:w-[56%] xs:w-2/3 sm:w-1/2 md:w-[40%] ${
            isHome ? ' sm:w-full md:w-1/2 lg:w-[55%] xl:w-1/2' : 'xl:w-1/3 '
          }`}
          data-name='name-column'
        >
          <Link href={`/${address}`} className='w-fit'>
            <Avatar
              name={name || address}
              avatarUrl={avatar}
              size='h-[45px] w-[45px] md:h-[50px] md:w-[50px] hover:opacity-80 transition-all hover:scale-110 transition-all'
            />
          </Link>
          <div
            className='flex flex-col items-start justify-center text-left'
            style={{ maxWidth: 'calc(100% - 60px)' }}
          >
            <Link href={`/${address}`} className='w-full'>
              <p className='font-bold text-base xxs:text-lg truncate max-w-full hover:opacity-60 hover:scale-110 transition-all'>
                {name && isValidEnsName(name) ? name : truncateAddress(address)}
              </p>
            </Link>
            <div
              className={`rounded-full font-bold text-[10px] flex items-center justify-center text-darkGrey bg-zinc-300 h-5 w-20 ${followerTag.className}`}
            >
              {t(followerTag.text)}
            </div>
          </div>
        </div>
        <div
          className={`items-center justify-around hidden sm:flex sm:w-1/5 md:w-[55%] ${
            isHome ? 'sm:w-1/4 md:w-1/3 lg:w-2/3 xl:w-1/4' : ''
          }`}
        >
          {firstStat && (
            <div
              className={cn(
                'flex-col items-center flex',
                firstStat !== 'mutuals' && 'cursor-pointer hover:scale-110 transition-transform'
              )}
              onClick={() => {
                switch (firstStat) {
                  case 'followers':
                    router.push(`/${address}?tab=followers`)
                    break
                  case 'following':
                    router.push(`/${address}?tab=following`)
                    break
                  case 'mutuals':
                    break
                  case 'blocked':
                    router.push(`/${address}?modal=blockmutelists`)
                    break
                  default:
                    break
                }
              }}
            >
              <p className='font-bold text-sm sm:text-lg'>
                {formatNumber(
                  {
                    followers,
                    following,
                    mutuals,
                    top8,
                    blocked
                  }[firstStat] || 0
                )}
              </p>
              <p className='font-bold text-sm capitalize text-[#888] dark:text-[#aaa]'>
                {t(firstStat)}
              </p>
            </div>
          )}
          <div
            className={`${
              firstStat === 'mutuals' ? 'hidden' : 'hidden md:flex'
            } flex-col items-center`}
          >
            <p className='font-bold text-sm sm:text-lg'>{formatNumber(mutuals || 0)}</p>
            <p className='font-bold text-sm  text-[#888] dark:text-[#aaa]'>{t('mutuals')}</p>
          </div>
          <div
            className={`${
              firstStat && firstStat === 'followers'
                ? 'hidden'
                : firstStat === 'mutuals'
                  ? 'hidden: md:flex'
                  : 'hidden lg:flex'
            } transition-all hover:scale-110 cursor-pointer flex-col items-center`}
            onClick={() => router.push(`/${address}?tab=followers`)}
          >
            <p className='font-bold text-sm sm:text-lg'>{formatNumber(followers || 0)}</p>
            <p className='font-bold text-sm  text-[#888] dark:text-[#aaa]'>{t('followers')}</p>
          </div>
          <div
            className={`${
              firstStat && firstStat === 'following' ? 'hidden' : 'hidden lg:flex'
            } transition-all hover:scale-110 cursor-pointer flex-col items-center`}
            onClick={() => router.push(`/${address}?tab=following`)}
          >
            <p className='font-bold text-sm sm:text-lg'>{formatNumber(following || 0)}</p>
            <p className='font-bold text-sm  text-[#888] dark:text-[#aaa]'>{t('following')}</p>
          </div>
          <div
            className={`${
              (firstStat && firstStat === 'top8') || firstStat === 'blocked'
                ? 'hidden'
                : `hidden lg:flex ${isHome ? 'xl:hidden' : ''}`
            } transition-all hover:scale-110 cursor-pointer flex-col items-center`}
            onClick={() => router.push(`/${address}?tab=following`)}
          >
            <p className='font-bold text-sm sm:text-lg'>{formatNumber(top8 || 0)}</p>
            <p className='font-bold text-sm text-[#888] dark:text-[#aaa]'>{t('top8')}</p>
          </div>
          {/* <div
            className={` transition-all hover:scale-110 cursor-pointer flex-col items-center w-1/2 lg:w-1/3 xl:w-1/4 hidden xl:flex ${
              isHome ? 'lg:flex xl:hidden' : ''
            } `}
            onClick={() => router.push(`/${address}?modal=blockmutelists`)}
          >
            <p className='font-bold text-sm sm:text-lg'>{formatNumber(blocked || 0)}</p>
            <p className='font-bold text-sm  text-[#888] dark:text-[#aaa]'>{t('blocked')}</p>
          </div> */}
        </div>
        <div
          className={`w-fit ${
            isHome ? 'lg:w-[25%] 2xl:w-[20%]' : 'lg:w-[15%] 2xl:w-[10%]'
          } flex justify-end`}
        >
          <FollowButton address={address} />
        </div>
      </div>
      <div className={`items-center justify-evenly flex sm:hidden w-full`}>
        {firstStat && (
          <div
            className={cn(
              'flex-col items-center flex',
              firstStat !== 'mutuals' && 'cursor-pointer hover:scale-110 transition-transform'
            )}
            onClick={() => {
              switch (firstStat) {
                case 'followers':
                  router.push(`/${address}?tab=followers`)
                  break
                case 'following':
                  router.push(`/${address}?tab=following`)
                  break
                case 'mutuals':
                  break
                case 'top8':
                  router.push(`/${address}?tab=followers`)
                  break
                case 'blocked':
                  router.push(`/${address}?modal=blockmutelists`)
                  break
                default:
                  break
              }
            }}
          >
            <p className='font-bold text-sm sm:text-lg'>
              {formatNumber(
                {
                  followers,
                  following,
                  mutuals,
                  top8,
                  blocked
                }[firstStat] || 0
              )}
            </p>
            <p className='font-bold text-sm capitalize text-[#888] dark:text-[#aaa]'>{firstStat}</p>
          </div>
        )}
        <div
          className={cn('flex-col flex items-center', firstStat === 'mutuals' ? 'hidden' : 'flex')}
        >
          <p className='font-bold text-sm sm:text-lg'>{formatNumber(mutuals || 0)}</p>
          <p className='font-bold text-sm  text-[#888] dark:text-[#aaa]'>{t('mutuals')}</p>
        </div>
        <div
          className={cn(
            'transition-all hover:scale-110 cursor-pointer flex-col items-center',
            firstStat === 'followers' ? 'hidden' : 'flex'
          )}
          onClick={() => router.push(`/${address}?tab=followers`)}
        >
          <p className='font-bold text-sm sm:text-lg'>{formatNumber(followers || 0)}</p>
          <p className='font-bold text-sm  text-[#888] dark:text-[#aaa]'>{t('followers')}</p>
        </div>
        <div
          className={cn(
            'transition-all hover:scale-110 cursor-pointer flex-col items-center',
            firstStat === 'following' ? 'hidden' : 'flex'
          )}
          onClick={() => router.push(`/${address}?tab=following`)}
        >
          <p className='font-bold text-sm sm:text-lg'>{formatNumber(following || 0)}</p>
          <p className='font-bold text-sm  text-[#888] dark:text-[#aaa]'>{t('following')}</p>
        </div>
        <div
          className={cn(
            firstStat === 'blocked' || firstStat === 'top8' ? 'hidden' : 'flex',
            'transition-all hover:scale-110 cursor-pointer flex-col items-center'
          )}
          onClick={() => router.push(`/${address}`)}
        >
          <p className='font-bold text-sm sm:text-lg'>{formatNumber(top8 || 0)}</p>
          <p className='font-bold text-sm  text-[#888] dark:text-[#aaa]'>{t('top8')}</p>
        </div>
      </div>
    </div>
  )
}

export default TableRow
