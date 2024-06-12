import { isAddress, type Address } from 'viem'
import { formatAddressOrName } from '#/lib/utilities'
import type { ProfileDetailsResponse } from './requests'
import { resolveENSAddress, resolveENSProfile } from '#/utils/resolveAddress'

const fetchProfileDetails = async (addressOrName: string, list?: number) => {
  try {
    const url = list
      ? `${process.env.NEXT_PUBLIC_EFP_API_URL}/lists/${list}/details`
      : `${process.env.NEXT_PUBLIC_EFP_API_URL}/users/${formatAddressOrName(addressOrName)}/details`
    const response = await fetch(url, {
      cache: 'default'
      // cache: "no-cache",
    })

    const data = (await response.json()) as ProfileDetailsResponse
    return data
  } catch (err: unknown) {
    if (addressOrName.length === 0) return null

    const address = isAddress(addressOrName)
      ? addressOrName
      : await resolveENSAddress(`${addressOrName.replace('.eth', '')}.eth`)
    const data = await resolveENSProfile(address)

    if (data?.name && data?.avatar)
      return {
        address: address as Address,
        ens: data
      } as ProfileDetailsResponse

    return {
      address: address as Address,
      ens: { address: address as Address }
    } as ProfileDetailsResponse
  }
}

export default fetchProfileDetails
