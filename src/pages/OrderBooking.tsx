import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, DollarSign, Loader2, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Influencer } from '@/types'

const DELIVERABLES = [
  'Postingan Instagram',
  'Story Instagram',
  'Reel Instagram',
  'Video TikTok',
  'Video YouTube',
  'Postingan Twitter/X',
  'Postingan Blog',
  'Ulasan Produk'
]

export function OrderBooking() {
  const { influencerId } = useParams<{ influencerId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [influencer, setInfluencer] = useState<Influencer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    deliverables: [] as string[],
    deliveryDate: ''
  })

  useEffect(() => {
    async function fetchInfluencer() {
      if (!influencerId) return

      try {
        const { data, error } = await supabase
          .from('influencers')
          .select('*, user:users(*)')
          .eq('id', influencerId)
          .single()

        if (error) throw error
        setInfluencer(data)
      } catch (error) {
        console.error('Error fetching influencer:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInfluencer()
  }, [influencerId])

  const MIN_PRICE = 0
  const MAX_PRICE = 100000
  const PLATFORM_FEE_RATE = 0.1

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !influencer) return

    const price = influencer.price_per_post
    if (typeof price !== 'number' || price < MIN_PRICE || price > MAX_PRICE) {
      alert('Harga tidak valid. Silakan hubungi dukungan.')
      return
    }

    const invalidDeliverables = formData.deliverables.filter((d) => !DELIVERABLES.includes(d))
    if (invalidDeliverables.length > 0) {
      alert('Deliverables yang dipilih tidak valid.')
      return
    }

    const deliveryDate = new Date(formData.deliveryDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (deliveryDate < today) {
      alert('Tanggal pengiriman harus di masa depan.')
      return
    }

    setIsSubmitting(true)

    try {
      const platformFee = Math.round(price * PLATFORM_FEE_RATE * 100) / 100
      const totalPrice = Math.round((price + platformFee) * 100) / 100

      const orderData: {
        influencer_id: string
        sme_id: string
        title: string
        description: string | null
        requirements: string | null
        deliverables: string[]
        delivery_date: string | null
        total_price: number
        platform_fee: number
      } = {
        influencer_id: influencerId,
        sme_id: user.id,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        requirements: formData.requirements.trim() || null,
        deliverables: formData.deliverables,
        delivery_date: formData.deliveryDate || null,
        total_price: totalPrice,
        platform_fee: platformFee
      }

      const { error } = await supabase.from('orders').insert(orderData)

      if (error) throw error
      setIsSuccess(true)
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Gagal membuat pesanan. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleDeliverable = (deliverable: string) => {
    setFormData((prev) => ({
      ...prev,
      deliverables: prev.deliverables.includes(deliverable)
        ? prev.deliverables.filter((d) => d !== deliverable)
        : [...prev.deliverables, deliverable]
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!influencer) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
          Influencer tidak ditemukan
        </h2>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg py-12 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
            Permintaan Pemesanan Terkirim!
          </h2>
          <p className="text-gray-600 mb-6">
            Permintaan kolaborasi Anda telah dikirim ke {influencer.user?.name}. Mereka akan
            meninjau permintaan Anda dan merespons dalam waktu 24 jam.
          </p>
          <button onClick={() => navigate('/influencers')} className="btn-primary w-full">
            Jelajahi Influencer Lainnya
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in min-h-screen gradient-bg py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-gray-100">
            <img
              src={
                influencer.user?.avatar_url ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${influencer.id}`
              }
              alt={influencer.user?.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div>
              <h1 className="font-display text-2xl font-bold text-gray-900">Pesan Kolaborasi</h1>
              <p className="text-gray-600">dengan {influencer.user?.name}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Judul Kampanye *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                placeholder="Contoh: Peluncuran Koleksi Musim Panas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Kampanye *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field resize-none"
                placeholder="Jelaskan kampanye Anda, tujuan, dan apa yang Anda cari..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Persyaratan Spesifik
              </label>
              <textarea
                rows={3}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="input-field resize-none"
                placeholder="Persyaratan spesifik, hashtag, atau panduan apa pun..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Deliverables *</label>
              <div className="grid grid-cols-2 gap-3">
                {DELIVERABLES.map((deliverable) => (
                  <button
                    key={deliverable}
                    type="button"
                    onClick={() => toggleDeliverable(deliverable)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      formData.deliverables.includes(deliverable)
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          formData.deliverables.includes(deliverable)
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {formData.deliverables.includes(deliverable) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium">{deliverable}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Pengiriman *
              </label>
              <input
                type="date"
                required
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Biaya Layanan</span>
                <span className="font-medium">
                  Rp {(influencer.price_per_post * 15000).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Biaya Platform (10%)</span>
                <span className="font-medium">
                  Rp {(influencer.price_per_post * 15000 * 0.1).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-display text-2xl font-bold text-primary-600">
                  Rp {(influencer.price_per_post * 15000 * 1.1).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || formData.deliverables.length === 0}
              className="w-full btn-primary py-4 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <DollarSign className="w-5 h-5" />
                  <span>Kirim Permintaan Pemesanan</span>
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Dengan mengirimkan permintaan ini, Anda setuju dengan Syarat dan Ketentuan kami.
              Pembayaran hanya akan diproses setelah influencer menerima permintaan Anda.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
