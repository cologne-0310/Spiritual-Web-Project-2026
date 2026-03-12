/**
 * Sajeev B2B Site Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Sajeev Partner Site Initialized');
    
    // Auto-detect referral in URL to support sharing teacher links
    detectTeacherReferral();
});

function detectTeacherReferral() {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
        // Shared storage with source31 if using same domain or manual sync
        localStorage.setItem('yuan_point_ref', ref);
        console.log('Teacher Referral detected:', ref);
    }
}
