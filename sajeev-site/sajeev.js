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
        localStorage.setItem('yuan_point_ref', ref);
        console.log('Teacher Referral detected:', ref);
    } else if (!localStorage.getItem('yuan_point_ref')) {
        // Default to Sajeev himself if visiting his official partner site
        localStorage.setItem('yuan_point_ref', 'SAJEEV');
        console.log('Defaulting to Sajeev referral');
    }
}
