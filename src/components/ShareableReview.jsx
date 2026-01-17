import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import SpaceRadarChart, { SPACE_COLORS, SPACE_LABELS, SCORE_LABELS } from './SpaceRadarChart';

const ShareableReview = ({ review, onClose }) => {
  const cardRef = useRef(null);
  const [generating, setGenerating] = useState(false);
  const [format, setFormat] = useState('square'); // 'square' (Instagram) or 'landscape' (Twitter)
  const [posterBase64, setPosterBase64] = useState(null);
  const [posterLoading, setPosterLoading] = useState(true);
  const [posterError, setPosterError] = useState(false);
  const [copied, setCopied] = useState(false);

  const { movieData, scores, text } = review;

  // Find peaks (scores of 5 or highest)
  const maxScore = Math.max(...Object.values(scores));
  const peaks = Object.entries(scores)
    .filter(([_, score]) => score === maxScore && score >= 4)
    .map(([key]) => key);

  // Extract credits info
  const { processedCredits, languageName } = movieData;
  const directors = processedCredits?.directors || [];
  const topCast = processedCredits?.topCast || [];
  const composers = processedCredits?.composers || [];
  
  // Build short credits line for share image
  const creditsLineParts = [];
  if (directors.length > 0) {
    creditsLineParts.push(`Dir: ${directors[0]}`);
  }
  if (topCast.length > 0) {
    creditsLineParts.push(topCast.slice(0, 2).join(', '));
  }
  if (composers.length > 0) {
    creditsLineParts.push(`🎵 ${composers[0]}`);
  }
  const creditsLine = creditsLineParts.join(' • ');

  // Convert poster to base64 on mount
  useEffect(() => {
    const loadPoster = async () => {
      if (!movieData.poster_path) {
        setPosterLoading(false);
        setPosterError(true);
        return;
      }

      const imageUrl = `https://image.tmdb.org/t/p/w185${movieData.poster_path}`;
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          setPosterBase64(dataUrl);
          setPosterLoading(false);
        } catch (err) {
          console.error('Canvas conversion failed (CORS):', err);
          setPosterError(true);
          setPosterLoading(false);
        }
      };
      
      img.onerror = () => {
        console.error('Image failed to load');
        setPosterError(true);
        setPosterLoading(false);
      };
      
      img.src = imageUrl + '?t=' + Date.now();
    };

    loadPoster();
  }, [movieData.poster_path]);

  const posterUrl = movieData.poster_path 
    ? `https://image.tmdb.org/t/p/w185${movieData.poster_path}`
    : null;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setGenerating(true);
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#0a0a0f',
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
      
      const link = document.createElement('a');
      link.download = `${movieData.title.replace(/[^a-z0-9]/gi, '_')}_SPACE_review.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to generate image:', err);
      alert('Failed to generate image. Try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyImage = async () => {
    if (!cardRef.current) return;
    
    setGenerating(true);
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#0a0a0f',
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
      
      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
          alert('Failed to copy image. Try downloading instead.');
        }
      }, 'image/png');
    } catch (err) {
      console.error('Failed to generate image:', err);
      alert('Failed to generate image. Try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleShareTwitter = () => {
    const scoreText = Object.entries(scores)
      .map(([key, score]) => `${key}:${score}`)
      .join(' ');
    
    const tweetText = `Just reviewed "${movieData.title}" using SPACE ratings!\n\n${scoreText}\n\n${peaks.length > 0 ? `Peak: ${peaks.join(', ')}\n\n` : ''}#MovieClub #SPACE #FilmReview`;
    
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, '_blank', 'width=550,height=420');
  };

  const dimensions = format === 'square' 
    ? { width: 600, height: 680 } 
    : { width: 700, height: 400 };

  // SPACE dimension order
  const SPACE_ORDER = ['S', 'P', 'A', 'C', 'E'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-midnight/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-charcoal border border-slate rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-charcoal border-b border-slate p-4 flex items-center justify-between z-10">
          <h2 className="font-display text-xl text-cream">Share Your Review</h2>
          <button
            onClick={onClose}
            className="p-2 text-silver hover:text-cream transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Format Toggle */}
        <div className="p-4 border-b border-slate">
          <div className="flex gap-2">
            <button
              onClick={() => setFormat('square')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                format === 'square'
                  ? 'bg-gold text-midnight'
                  : 'bg-slate/50 text-silver hover:text-cream'
              }`}
            >
              Square (Instagram)
            </button>
            <button
              onClick={() => setFormat('landscape')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                format === 'landscape'
                  ? 'bg-gold text-midnight'
                  : 'bg-slate/50 text-silver hover:text-cream'
              }`}
            >
              Landscape (Twitter)
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 flex justify-center overflow-auto">
          {posterLoading ? (
            <div className="flex items-center justify-center" style={{ width: dimensions.width, height: dimensions.height }}>
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div 
              ref={cardRef}
              style={{
                width: dimensions.width,
                height: dimensions.height,
                fontFamily: 'Georgia, "Times New Roman", Times, serif',
              }}
              className="relative bg-[#0a0a0f] overflow-hidden"
            >
              {/* Background gradient */}
              <div 
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(ellipse at top right, rgba(212, 175, 55, 0.08) 0%, transparent 50%)',
                }}
              />
              
              {format === 'square' ? (
                /* Square Layout (Instagram) - New Design */
                <div className="relative h-full p-6 flex flex-col">
                  {/* Top: Movie info */}
                  <div className="flex gap-4 mb-5">
                    {(posterBase64 || posterUrl) && (
                      <div className="w-24 h-36 flex-shrink-0">
                        {posterBase64 ? (
                          <img
                            src={posterBase64}
                            alt={movieData.title}
                            className="w-24 h-36 object-cover rounded shadow-lg"
                          />
                        ) : (
                          <div className="w-24 h-36 rounded shadow-lg bg-gradient-to-br from-[#2a2a3a] to-[#1a1a24] flex items-center justify-center border border-[#3a3a4a]">
                            <svg className="w-10 h-10 text-[#4a4a5a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="text-[#f5f5f0] text-2xl font-bold leading-tight"
                        style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                      >
                        {movieData.title}
                      </h3>
                      <p className="text-[#a0a0b0] text-sm mt-1">
                        {movieData.release_date?.split('-')[0]}
                        {languageName && ` • ${languageName}`}
                      </p>
                      {creditsLine && (
                        <p 
                          className="text-[#808090] text-xs mt-2 leading-relaxed"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          {creditsLine}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Middle: Chart (left) + Legend (right) */}
                  <div className="flex-1 flex items-center gap-6">
                    {/* Radar Chart - Color coded */}
                    <div className="flex-shrink-0">
                      <SpaceRadarChart 
                        scores={scores} 
                        size={220} 
                        showLabels={true} 
                        showDots={false} 
                        colorCoded={true}
                      />
                    </div>
                    
                    {/* SPACE Legend */}
                    <div className="flex-1 space-y-3">
                      {SPACE_ORDER.map((key) => {
                        const score = scores[key];
                        const color = SPACE_COLORS[key];
                        const label = SPACE_LABELS[key];
                        const meaning = SCORE_LABELS[score];
                        
                        return (
                          <div key={key} className="flex items-center gap-3">
                            {/* Color indicator */}
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: color }}
                            >
                              <span 
                                className="text-[#0a0a0f] font-bold text-sm"
                                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                              >
                                {key}
                              </span>
                            </div>
                            
                            {/* Category + Score + Meaning */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2">
                                <span 
                                  className="text-[#f5f5f0] font-semibold text-base"
                                  style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                                >
                                  {label}
                                </span>
                                <span 
                                  className="text-[#d4af37] font-bold text-lg"
                                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                                >
                                  {score}
                                </span>
                              </div>
                              <span 
                                className="text-[#808090] text-xs"
                                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                              >
                                {meaning}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Bottom: Branding */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#2a2a3a]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#d4af37]" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" />
                        </svg>
                      </div>
                      <span 
                        className="text-[#f5f5f0] text-base font-bold"
                        style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                      >
                        Movie Club
                      </span>
                      <span className="text-[#a0a0b0] text-sm">
                        SPACE Reviews
                      </span>
                    </div>
                    <div className="text-[#606070] text-xs">
                      Film data: TMDB
                    </div>
                  </div>
                </div>
              ) : (
                /* Landscape Layout (Twitter) - New Design */
                <div className="relative h-full p-5 flex gap-5">
                  {/* Left: Poster */}
                  {(posterBase64 || posterUrl) && (
                    <div className="w-20 h-30 flex-shrink-0 self-center">
                      {posterBase64 ? (
                        <img
                          src={posterBase64}
                          alt={movieData.title}
                          className="w-20 h-30 object-cover rounded shadow-lg"
                        />
                      ) : (
                        <div className="w-20 h-30 rounded shadow-lg bg-gradient-to-br from-[#2a2a3a] to-[#1a1a24] flex items-center justify-center border border-[#3a3a4a]">
                          <svg className="w-8 h-8 text-[#4a4a5a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Middle: Radar Chart */}
                  <div className="flex-shrink-0 flex items-center">
                    <SpaceRadarChart 
                      scores={scores} 
                      size={180} 
                      showLabels={true} 
                      showDots={false} 
                      colorCoded={true}
                    />
                  </div>
                  
                  {/* Right: Info + Legend */}
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    {/* Title & Credits */}
                    <h3 
                      className="text-[#f5f5f0] text-xl font-bold leading-tight"
                      style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                    >
                      {movieData.title}
                    </h3>
                    <p className="text-[#a0a0b0] text-xs mt-0.5">
                      {movieData.release_date?.split('-')[0]}
                      {languageName && ` • ${languageName}`}
                      {creditsLine && ` • ${creditsLine}`}
                    </p>
                    
                    {/* Compact SPACE Legend */}
                    <div className="mt-3 space-y-1.5">
                      {SPACE_ORDER.map((key) => {
                        const score = scores[key];
                        const color = SPACE_COLORS[key];
                        const label = SPACE_LABELS[key];
                        const meaning = SCORE_LABELS[score];
                        
                        return (
                          <div key={key} className="flex items-center gap-2">
                            <div 
                              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: color }}
                            >
                              <span 
                                className="text-[#0a0a0f] font-bold text-xs"
                                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                              >
                                {key}
                              </span>
                            </div>
                            <span 
                              className="text-[#f5f5f0] text-xs font-medium w-20"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            >
                              {label}
                            </span>
                            <span 
                              className="text-[#d4af37] font-bold text-sm w-4"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            >
                              {score}
                            </span>
                            <span 
                              className="text-[#707080] text-xs"
                              style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                            >
                              {meaning}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Branding */}
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#2a2a3a]">
                      <div className="w-4 h-4 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
                        <svg className="w-2 h-2 text-[#d4af37]" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" />
                        </svg>
                      </div>
                      <span 
                        className="text-[#f5f5f0] text-xs font-bold"
                        style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                      >
                        Movie Club
                      </span>
                      <span className="text-[#606070] text-xs ml-auto">
                        TMDB
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-charcoal border-t border-slate p-4 space-y-3">
          {/* Primary actions */}
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              disabled={generating || posterLoading}
              className="flex-1 py-3 bg-gold hover:bg-gold-light disabled:bg-gold/50 text-midnight font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {generating ? (
                <div className="w-5 h-5 border-2 border-midnight border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
              Download
            </button>
            <button
              onClick={handleCopyImage}
              disabled={generating || posterLoading}
              className="flex-1 py-3 bg-slate hover:bg-slate/80 disabled:bg-slate/50 text-cream font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Image
                </>
              )}
            </button>
          </div>
          
          {/* Social sharing */}
          <div className="flex gap-3">
            <button
              onClick={handleShareTwitter}
              className="flex-1 py-3 bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 text-[#1DA1F2] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Share on X
            </button>
            <button
              onClick={handleDownload}
              disabled={generating || posterLoading}
              className="flex-1 py-3 bg-gradient-to-r from-[#833AB4]/20 via-[#FD1D1D]/20 to-[#F77737]/20 hover:from-[#833AB4]/30 hover:via-[#FD1D1D]/30 hover:to-[#F77737]/30 text-[#E1306C] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Download for Instagram
            </button>
          </div>
          
          <p className="text-center text-slate text-xs">
            {posterError && !posterBase64 
              ? "Note: Poster couldn't be embedded. The share image will use a placeholder."
              : "Download the image, then share to Instagram Stories or post"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareableReview;
