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

  // Use full review text (already limited to 280 chars at input)
  const reviewText = text;

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
    
    const tweetText = `Just reviewed "${movieData.title}" using SPACE ratings!\n\n${scoreText}\n\n#MovieClub #SPACE #FilmReview`;
    
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, '_blank', 'width=550,height=420');
  };

  const dimensions = format === 'square' 
    ? { width: 600, height: 780 } 
    : { width: 640, height: 280 };

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
        {/* Header with platform toggle */}
        <div className="sticky top-0 bg-charcoal border-b border-slate p-4 flex items-center justify-between z-10">
          <h2 className="font-display text-xl text-cream">Share Your Review</h2>
          
          {/* Platform toggle as icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFormat('square')}
              className={`p-2 rounded-lg transition-colors ${
                format === 'square'
                  ? 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white'
                  : 'bg-slate/50 text-silver hover:text-cream'
              }`}
              title="Instagram (Square)"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </button>
            <button
              onClick={() => setFormat('landscape')}
              className={`p-2 rounded-lg transition-colors ${
                format === 'landscape'
                  ? 'bg-[#1DA1F2] text-white'
                  : 'bg-slate/50 text-silver hover:text-cream'
              }`}
              title="X / Twitter (Landscape)"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>
            
            <div className="w-px h-6 bg-slate mx-1" />
            
            <button
              onClick={onClose}
              className="p-2 text-silver hover:text-cream transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
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
                /* Square Layout (Instagram) */
                <div className="relative h-full p-5 flex flex-col">
                  {/* Top: Movie info */}
                  <div className="flex gap-4 mb-4">
                    {(posterBase64 || posterUrl) && (
                      <div className="w-20 h-30 flex-shrink-0">
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
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="text-[#f5f5f0] text-xl font-bold leading-tight"
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
                          className="text-[#a0a0b0] text-xs mt-1 leading-relaxed"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        >
                          {creditsLine}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Middle: Chart (left) + Legend (right) */}
                  <div className="flex-1 flex items-center gap-4">
                    {/* Radar Chart - Color coded */}
                    <div className="flex-shrink-0">
                      <SpaceRadarChart 
                        scores={scores} 
                        size={200} 
                        showLabels={true} 
                        showDots={false} 
                        colorCoded={true}
                      />
                    </div>
                    
                    {/* SPACE Legend */}
                    <div className="flex-1 space-y-2">
                      {SPACE_ORDER.map((key) => {
                        const score = scores[key];
                        const color = SPACE_COLORS[key];
                        const label = SPACE_LABELS[key];
                        const meaning = SCORE_LABELS[score];
                        
                        return (
                          <div key={key} className="flex items-center gap-2">
                            {/* Color indicator */}
                            <div 
                              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: color }}
                            >
                              <span 
                                className="text-[#0a0a0f] font-bold text-xs"
                                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                              >
                                {key}
                              </span>
                            </div>
                            
                            {/* Category + Score + Meaning */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2">
                                <span 
                                  className="text-[#f5f5f0] font-semibold text-sm"
                                  style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                                >
                                  {label}
                                </span>
                                <span 
                                  className="text-[#d4af37] font-bold text-base"
                                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                                >
                                  {score}
                                </span>
                              </div>
                              <span 
                                className="text-[#707080] text-xs"
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
                  
                  {/* Review Text */}
                  {reviewText && (
                    <div className="mt-4 pt-4 border-t border-[#2a2a3a]">
                      <p 
                        className="text-[#a0a0b0] text-sm italic leading-relaxed"
                        style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                      >
                        "{reviewText}"
                      </p>
                    </div>
                  )}
                  
                  {/* Bottom: Branding */}
                  <div className="flex items-center justify-between pt-4 mt-auto border-t border-[#2a2a3a]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-[#d4af37]" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" />
                        </svg>
                      </div>
                      <span 
                        className="text-[#f5f5f0] text-sm font-bold"
                        style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                      >
                        Movie Club
                      </span>
                      <span className="text-[#707080] text-xs">
                        SPACE Reviews
                      </span>
                    </div>
                    <div className="text-[#505060] text-xs">
                      Film data: TMDB
                    </div>
                  </div>
                </div>
              ) : (
                /* Landscape Layout (Twitter) - 3 Column: Poster | Radar+Brand | Info */
                <div className="relative h-full p-4 flex">
                  {/* Column 1: Poster */}
                  <div className="flex-shrink-0 flex items-center">
                    {(posterBase64 || posterUrl) ? (
                      posterBase64 ? (
                        <img
                          src={posterBase64}
                          alt={movieData.title}
                          className="w-24 h-36 object-cover rounded shadow-lg"
                        />
                      ) : (
                        <div className="w-24 h-36 rounded shadow-lg bg-gradient-to-br from-[#2a2a3a] to-[#1a1a24] flex items-center justify-center border border-[#3a3a4a]">
                          <svg className="w-8 h-8 text-[#4a4a5a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                          </svg>
                        </div>
                      )
                    ) : null}
                  </div>
                  
                  {/* Column 2: Radar + Branding */}
                  <div className="flex flex-col items-center justify-center px-3">
                    <SpaceRadarChart 
                      scores={scores} 
                      size={180} 
                      showLabels={true} 
                      showDots={false} 
                      colorCoded={true}
                    />
                    {/* Branding under radar */}
                    <div className="flex items-center gap-1.5 -mt-2">
                      <div className="w-5 h-5 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-[#d4af37]" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" />
                        </svg>
                      </div>
                      <span 
                        className="text-[#f5f5f0] text-sm font-bold"
                        style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                      >
                        Movie Club
                      </span>
                    </div>
                  </div>
                  
                  {/* Column 3: Info + Scores + Review */}
                  <div className="flex-1 flex flex-col justify-center min-w-0 pl-2">
                    {/* Title */}
                    <h3 
                      className="text-[#f5f5f0] text-lg font-bold leading-tight"
                      style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                    >
                      {movieData.title}
                    </h3>
                    
                    {/* Year & Language */}
                    <p className="text-[#a0a0b0] text-sm mt-0.5">
                      {movieData.release_date?.split('-')[0]}
                      {languageName && ` • ${languageName}`}
                    </p>
                    
                    {/* Credits */}
                    {creditsLine && (
                      <p 
                        className="text-[#808090] text-xs mt-1 leading-snug"
                        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                      >
                        {creditsLine}
                      </p>
                    )}
                    
                    {/* SPACE Scores - Compact Row */}
                    <div 
                      className="flex items-center gap-3 mt-3 py-2 border-t border-b border-[#2a2a3a]"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    >
                      {SPACE_ORDER.map((key) => {
                        const score = scores[key];
                        const color = SPACE_COLORS[key];
                        return (
                          <div key={key} className="flex items-center gap-1">
                            <span 
                              className="font-bold text-sm"
                              style={{ color }}
                            >
                              {key}
                            </span>
                            <span className="text-[#f5f5f0] text-sm font-semibold">
                              {score}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Review Text */}
                    {reviewText && (
                      <p 
                        className="text-[#a0a0b0] text-xs italic mt-2 leading-snug flex-1"
                        style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                      >
                        "{reviewText}"
                      </p>
                    )}
                    
                    {/* TMDB attribution */}
                    <div className="mt-auto">
                      <span className="text-[#505060] text-xs">
                        TMDB
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions - Compact */}
        <div className="sticky bottom-0 bg-charcoal border-t border-slate p-3">
          <div className="flex items-center justify-between gap-3">
            {/* Left: Status text */}
            <p className="text-slate text-xs flex-1">
              {posterError && !posterBase64 
                ? "Poster unavailable"
                : format === 'square' ? "Instagram ready" : "X ready"
              }
            </p>
            
            {/* Right: Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyImage}
                disabled={generating || posterLoading}
                className="px-3 py-2 bg-slate/50 hover:bg-slate disabled:bg-slate/30 text-cream text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
                title="Copy to clipboard"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
              
              <button
                onClick={handleDownload}
                disabled={generating || posterLoading}
                className="px-4 py-2 bg-gold hover:bg-gold-light disabled:bg-gold/50 text-midnight text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                {generating ? (
                  <div className="w-4 h-4 border-2 border-midnight border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
                Download
              </button>
              
              {format === 'landscape' && (
                <button
                  onClick={handleShareTwitter}
                  className="px-3 py-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
                  title="Open X with pre-filled text"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Post
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareableReview;
