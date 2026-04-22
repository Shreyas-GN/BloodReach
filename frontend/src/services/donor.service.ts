import { supabaseClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export class DonorService {
  /**
   * Fetches nearby donors using the PostGIS ST_DWithin helper function via RPC.
   *
   * @param lat - Search latitude
   * @param lng - Search longitude
   * @param radiusKm - Radius in Kilometers limits the search
   * @returns Array of nearby donors sorted by distance
   */
  static async getNearbyDonors(lat: number, lng: number, radiusKm: number) {
    const { data, error } = await (supabaseClient as any).rpc('find_nearby_donors', {
      lat: lat,
      lng: lng,
      radius_km: radiusKm,
    })

    if (error) {
      throw new Error(`Failed to fetch nearby donors: ${error.message}`)
    }

    return data
  }

  /**
   * Fetches a specific donor's profile by their authenticating User ID.
   */
  static async getProfile(userId: string) {
    const { data, error } = await (supabaseClient as any)
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
       throw new Error(`Failed to fetch profile: ${error.message}`)
    }
    
    return data
  }

  static async createProfile(profileData: ProfileInsert) {
    const { data, error } = await (supabaseClient as any)
      .from('profiles')
      .insert(profileData)
      .select()
      .single()

    if (error) {
       throw new Error(`Failed to create profile: ${error.message}`)
    }
    
    return data
  }

  static async updateProfile(userId: string, profileData: ProfileUpdate) {
    const { data, error } = await (supabaseClient as any)
      .from('profiles')
      .upsert({ id: userId, ...profileData })
      .select()
      .single()

    if (error) {
       throw new Error(`Failed to update profile: ${error.message}`)
    }
    
    return data
  }
}
