import React, { useState, useMemo } from 'react';
import {
  Megaphone,
  Plus,
  Edit,
  Trash2,
  Eye,
  MousePointerClick,
  TrendingUp,
  Percent,
  CheckCircle2,
  XCircle,
  Smartphone,
  Monitor,
  Layers,
  Calendar,
  ExternalLink,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  X,
  Play
} from 'lucide-react';
import { useAds } from '../../context/AdsContext';
import { Advertisement, AdPlacement, AdType, DeviceTarget } from '../../types';
import { AD_PLACEMENTS_MAP, AD_TYPES_MAP } from '../../data/seedAds';

export const AdminAdsPage: React.FC = () => {
  const {
    ads,
    createAd,
    updateAd,
    deleteAd,
    toggleAdStatus,
    resetAdsToDefault
  } = useAds();

  const [search, setSearch] = useState('');
  const [filterPlacement, setFilterPlacement] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDevice, setFilterDevice] = useState<string>('all');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [previewAd, setPreviewAd] = useState<Advertisement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Advertisement | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Fields State
  const [name, setName] = useState('');
  const [type, setType] = useState<AdType>('homepage_banner');
  const [placement, setPlacement] = useState<AdPlacement>('homepage_top');
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [callToAction, setCallToAction] = useState('Learn More');
  const [sponsorName, setSponsorName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [adCode, setAdCode] = useState('');
  const [active, setActive] = useState(true);
  const [device, setDevice] = useState<DeviceTarget>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxImpressions, setMaxImpressions] = useState<number | undefined>(undefined);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Analytics Calculations
  const analytics = useMemo(() => {
    const totalImpressions = ads.reduce((acc, a) => acc + (a.impressions || 0), 0);
    const totalClicks = ads.reduce((acc, a) => acc + (a.clicks || 0), 0);
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const activeAdsCount = ads.filter((a) => a.active).length;

    const topAd = [...ads].sort((a, b) => {
      const ctrA = a.impressions > 0 ? (a.clicks / a.impressions) * 100 : 0;
      const ctrB = b.impressions > 0 ? (b.clicks / b.impressions) * 100 : 0;
      return ctrB - ctrA;
    })[0];

    return {
      totalImpressions,
      totalClicks,
      ctr,
      activeAdsCount,
      topAd
    };
  }, [ads]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingAd(null);
    setName('');
    setType('homepage_banner');
    setPlacement('homepage_top');
    setHeadline('');
    setDescription('');
    setCallToAction('Learn More');
    setSponsorName('');
    setImageUrl('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80');
    setTargetUrl('https://example.com');
    setAdCode('');
    setActive(true);
    setDevice('all');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setMaxImpressions(undefined);
    setIsFormOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (ad: Advertisement) => {
    setEditingAd(ad);
    setName(ad.name);
    setType(ad.type);
    setPlacement(ad.placement);
    setHeadline(ad.headline || '');
    setDescription(ad.description || '');
    setCallToAction(ad.callToAction || 'Learn More');
    setSponsorName(ad.sponsorName || '');
    setImageUrl(ad.imageUrl || '');
    setTargetUrl(ad.targetUrl);
    setAdCode(ad.adCode || '');
    setActive(ad.active);
    setDevice(ad.device);
    setStartDate(ad.startDate || '');
    setEndDate(ad.endDate || '');
    setMaxImpressions(ad.maxImpressions);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !targetUrl.trim()) {
      alert('Please provide advertisement name and target destination URL.');
      return;
    }

    setFormSubmitting(true);
    try {
      if (editingAd) {
        await updateAd(editingAd.id, {
          name,
          type,
          placement,
          headline,
          description,
          callToAction,
          sponsorName,
          imageUrl,
          targetUrl,
          adCode,
          active,
          device,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          maxImpressions: maxImpressions ? Number(maxImpressions) : undefined
        });
        showToast(`Advertisement "${name}" updated successfully.`);
      } else {
        await createAd({
          name,
          type,
          placement,
          headline,
          description,
          callToAction,
          sponsorName,
          imageUrl,
          targetUrl,
          adCode,
          active,
          device,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          maxImpressions: maxImpressions ? Number(maxImpressions) : undefined
        });
        showToast(`Advertisement "${name}" created successfully.`);
      }
      setIsFormOpen(false);
    } catch (err: any) {
      alert('Error saving advertisement: ' + err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteAd(deleteTarget.id);
      showToast(`Advertisement "${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
    } catch (e) {
      alert('Failed to delete advertisement.');
    }
  };

  const handleToggleActive = async (id: string, currentName: string) => {
    const newState = await toggleAdStatus(id);
    showToast(`"${currentName}" is now ${newState ? 'Active' : 'Disabled'}.`);
  };

  const handleResetSeed = async () => {
    if (window.confirm('Reset advertisement database to default authorized sample campaigns?')) {
      await resetAdsToDefault();
      showToast('Advertisements restored to sample campaigns.');
    }
  };

  // Filter ads
  const filteredAds = useMemo(() => {
    return ads.filter((ad) => {
      const matchSearch =
        ad.name.toLowerCase().includes(search.toLowerCase()) ||
        (ad.sponsorName && ad.sponsorName.toLowerCase().includes(search.toLowerCase())) ||
        (ad.headline && ad.headline.toLowerCase().includes(search.toLowerCase()));

      const matchPlacement = filterPlacement === 'all' || ad.placement === filterPlacement;
      const matchStatus =
        filterStatus === 'all' || (filterStatus === 'active' ? ad.active : !ad.active);
      const matchDevice = filterDevice === 'all' || ad.device === filterDevice;

      return matchSearch && matchPlacement && matchStatus && matchDevice;
    });
  }, [ads, search, filterPlacement, filterStatus, filterDevice]);

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold animate-fade-in flex items-center gap-2">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-600/20 text-red-500 border border-red-800/40">
              <Megaphone className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Advertisement Manager
            </h1>
          </div>
          <p className="text-neutral-400 text-sm mt-1">
            Configure banners, native ads, pre-stream interstitials, impressions, and device targeting.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetSeed}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-xs font-semibold text-neutral-300 transition-colors"
            title="Reset sample ad campaigns"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
            Reset Sample Ads
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-semibold shadow-md shadow-red-950/40 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Advertisement
          </button>
        </div>
      </div>

      {/* Analytics KPI Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Impressions */}
        <div className="bg-[#141414] p-5 rounded-2xl border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Impressions</span>
            <div className="p-2 rounded-lg bg-neutral-900 text-blue-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
            {analytics.totalImpressions.toLocaleString()}
          </div>
          <p className="text-xs text-neutral-500">Live verified ad views recorded</p>
        </div>

        {/* Clicks */}
        <div className="bg-[#141414] p-5 rounded-2xl border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Clicks</span>
            <div className="p-2 rounded-lg bg-neutral-900 text-emerald-400">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
            {analytics.totalClicks.toLocaleString()}
          </div>
          <p className="text-xs text-neutral-500">Outbound user interactions</p>
        </div>

        {/* CTR */}
        <div className="bg-[#141414] p-5 rounded-2xl border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Average CTR</span>
            <div className="p-2 rounded-lg bg-neutral-900 text-amber-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
            {analytics.ctr.toFixed(2)}%
          </div>
          <p className="text-xs text-neutral-500">(Total Clicks / Total Impressions) × 100</p>
        </div>

        {/* Active Ads */}
        <div className="bg-[#141414] p-5 rounded-2xl border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Campaigns</span>
            <div className="p-2 rounded-lg bg-neutral-900 text-red-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
            {analytics.activeAdsCount} <span className="text-sm font-normal text-neutral-500">/ {ads.length}</span>
          </div>
          <p className="text-xs text-emerald-400">Targeting desktop &amp; mobile</p>
        </div>
      </div>

      {/* Top Performing Campaign Spotlight */}
      {analytics.topAd && (
        <div className="bg-gradient-to-r from-red-950/20 via-[#141414] to-[#141414] p-5 rounded-2xl border border-red-900/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {analytics.topAd.imageUrl && (
              <img
                src={analytics.topAd.imageUrl}
                alt={analytics.topAd.name}
                className="w-16 h-16 object-cover rounded-xl bg-neutral-950 border border-neutral-800 shrink-0"
              />
            )}
            <div>
              <div className="flex items-center gap-2 text-xs text-red-400 font-semibold mb-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Top Performing Campaign</span>
              </div>
              <h3 className="text-base font-bold text-white">{analytics.topAd.name}</h3>
              <p className="text-xs text-neutral-400">
                {analytics.topAd.sponsorName || 'Direct Advertiser'} · Placement: <code className="text-neutral-300">{analytics.topAd.placement}</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-neutral-300">
            <div className="text-center sm:text-right">
              <span className="text-neutral-500 block text-[10px] uppercase font-mono">Impressions</span>
              <span className="font-mono font-bold text-white">{analytics.topAd.impressions.toLocaleString()}</span>
            </div>
            <div className="text-center sm:text-right">
              <span className="text-neutral-500 block text-[10px] uppercase font-mono">Clicks</span>
              <span className="font-mono font-bold text-white">{analytics.topAd.clicks.toLocaleString()}</span>
            </div>
            <div className="text-center sm:text-right">
              <span className="text-neutral-500 block text-[10px] uppercase font-mono">CTR</span>
              <span className="font-mono font-bold text-amber-400 text-sm">
                {analytics.topAd.impressions > 0
                  ? ((analytics.topAd.clicks / analytics.topAd.impressions) * 100).toFixed(2)
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-[#141414] p-4 rounded-xl border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns or sponsors..."
            className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Placement selector */}
          <select
            value={filterPlacement}
            onChange={(e) => setFilterPlacement(e.target.value)}
            className="bg-[#1c1c1c] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="all">All Placements</option>
            {AD_PLACEMENTS_MAP.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>

          {/* Status selector */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#1c1c1c] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="disabled">Disabled Only</option>
          </select>

          {/* Device selector */}
          <select
            value={filterDevice}
            onChange={(e) => setFilterDevice(e.target.value)}
            className="bg-[#1c1c1c] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="all">All Devices</option>
            <option value="desktop">Desktop Only</option>
            <option value="mobile">Mobile Only</option>
          </select>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-[#141414] rounded-2xl border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-neutral-400 border-b border-neutral-800 bg-neutral-900/60">
              <tr>
                <th className="py-3 px-4">Campaign &amp; Sponsor</th>
                <th className="py-3 px-4">Placement</th>
                <th className="py-3 px-4">Device</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Impressions</th>
                <th className="py-3 px-4">Clicks</th>
                <th className="py-3 px-4">CTR</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              {filteredAds.length > 0 ? (
                filteredAds.map((ad) => {
                  const ctr =
                    ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : '0.00';
                  return (
                    <tr key={ad.id} className="hover:bg-neutral-900/50 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        {ad.imageUrl ? (
                          <img
                            src={ad.imageUrl}
                            alt={ad.name}
                            className="w-10 h-10 object-cover rounded-lg bg-neutral-950 border border-neutral-800 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-neutral-900 flex items-center justify-center text-neutral-500 shrink-0">
                            <Layers className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="font-semibold text-white block truncate max-w-[200px]">
                            {ad.name}
                          </span>
                          <span className="text-[11px] text-neutral-500 block truncate max-w-[200px]">
                            {ad.sponsorName || 'Direct Partner'}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-neutral-800 text-neutral-300 font-mono">
                          {ad.placement}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="flex items-center gap-1.5 capitalize text-xs">
                          {ad.device === 'desktop' && <Monitor className="w-3.5 h-3.5 text-blue-400" />}
                          {ad.device === 'mobile' && <Smartphone className="w-3.5 h-3.5 text-emerald-400" />}
                          {ad.device === 'all' && <Layers className="w-3.5 h-3.5 text-neutral-400" />}
                          {ad.device}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(ad.id, ad.name)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                            ad.active
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900/60'
                              : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                          }`}
                        >
                          {ad.active ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" /> Disabled
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-mono tabular-nums">
                        {ad.impressions.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-mono tabular-nums">
                        {ad.clicks.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-mono tabular-nums font-bold text-amber-400">
                        {ctr}%
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-right space-x-1.5">
                        {/* Preview button */}
                        <button
                          onClick={() => setPreviewAd(ad)}
                          className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                          title="Preview Ad Layout"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit button */}
                        <button
                          onClick={() => handleOpenEdit(ad)}
                          className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                          title="Edit Settings"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={() => setDeleteTarget(ad)}
                          className="p-1.5 rounded bg-neutral-800 hover:bg-red-950/60 text-neutral-400 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    No advertisements match your current search and filter settings.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE & EDIT MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#141414] border border-neutral-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-red-500" />
                {editingAd ? `Edit Advertisement: ${editingAd.name}` : 'Create New Advertisement'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Campaign Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Bengal Fiber 4K Streaming"
                    className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Sponsor / Advertiser Name
                  </label>
                  <input
                    type="text"
                    value={sponsorName}
                    onChange={(e) => setSponsorName(e.target.value)}
                    placeholder="e.g. Bengal Telecom Ltd"
                    className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Ad Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as AdType)}
                    className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    {AD_TYPES_MAP.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Placement Location *
                  </label>
                  <select
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value as AdPlacement)}
                    className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    {AD_PLACEMENTS_MAP.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Stream 4K Cinema Without Buffering"
                    className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Call To Action Button Label
                  </label>
                  <input
                    type="text"
                    value={callToAction}
                    onChange={(e) => setCallToAction(e.target.value)}
                    placeholder="Learn More / Visit Site"
                    className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Description / Body Copy
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide supporting text for the banner or interstitial..."
                  className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Image Banner URL
                  </label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://... or /src/assets/images/..."
                    className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Target Destination URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://advertiser.com/landing-page"
                    className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600 font-mono"
                  />
                </div>
              </div>

              {/* Targeting & Schedule */}
              <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-3">
                <span className="text-xs font-bold text-white block">Targeting &amp; Delivery Limits</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Device Target</label>
                    <select
                      value={device}
                      onChange={(e) => setDevice(e.target.value as DeviceTarget)}
                      className="w-full bg-[#171717] border border-neutral-700 rounded-lg p-2 text-xs text-white"
                    >
                      <option value="all">All Devices (Responsive)</option>
                      <option value="desktop">Desktop Only</option>
                      <option value="mobile">Mobile Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-[#171717] border border-neutral-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-[#171717] border border-neutral-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Maximum Impressions Cap (Optional)</label>
                    <input
                      type="number"
                      value={maxImpressions || ''}
                      onChange={(e) => setMaxImpressions(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="e.g. 100000"
                      className="w-full bg-[#171717] border border-neutral-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 text-xs text-white cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={(e) => setActive(e.target.checked)}
                        className="rounded text-red-600 focus:ring-0 bg-neutral-800"
                      />
                      <span>Active / Published immediately</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold text-white shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {formSubmitting ? 'Saving...' : editingAd ? 'Update Campaign' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AD PREVIEW MODAL */}
      {previewAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#141414] border border-neutral-800 rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400" />
                  Live Preview: {previewAd.name}
                </h3>
                <span className="text-xs text-neutral-400">
                  Placement: <code className="text-red-400">{previewAd.placement}</code>
                </span>
              </div>

              {/* Viewport Dimension Toggle */}
              <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    previewDevice === 'desktop'
                      ? 'bg-neutral-800 text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" /> Desktop (728×90 / 970×250)
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    previewDevice === 'mobile'
                      ? 'bg-neutral-800 text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" /> Mobile (320×50 / 300×250)
                </button>
              </div>
            </div>

            {/* Simulated Frame */}
            <div className="p-6 bg-[#0a0a0a] rounded-xl border border-neutral-800/80 flex items-center justify-center min-h-[160px]">
              <div
                className={`transition-all ${
                  previewDevice === 'mobile' ? 'w-[320px]' : 'w-full max-w-2xl'
                }`}
              >
                <div className="text-[10px] text-neutral-500 uppercase tracking-widest pb-1 text-center font-mono">
                  Advertisement · {previewAd.sponsorName || 'Authorized Sponsor'}
                </div>

                <div className="bg-[#171717] border border-neutral-800 rounded-xl overflow-hidden p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    {previewAd.imageUrl && (
                      <img
                        src={previewAd.imageUrl}
                        alt={previewAd.headline || previewAd.name}
                        className="w-14 h-14 object-cover rounded-lg bg-neutral-900 shrink-0"
                      />
                    )}
                    <div>
                      <div className="text-xs font-bold text-white">
                        {previewAd.headline || previewAd.name}
                      </div>
                      <div className="text-[11px] text-neutral-400 line-clamp-2">
                        {previewAd.description}
                      </div>
                    </div>
                  </div>

                  <a
                    href={previewAd.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold shrink-0 flex items-center gap-1"
                  >
                    <span>{previewAd.callToAction || 'Learn More'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => setPreviewAd(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#171717] border border-neutral-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-500">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Delete Advertisement</h3>
            </div>
            <p className="text-sm text-neutral-300">
              Are you sure you want to permanently delete campaign{' '}
              <strong className="text-white">&ldquo;{deleteTarget.name}&rdquo;</strong>? All associated impression and click telemetry will be cleared.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold text-white shadow-md"
              >
                Delete Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
