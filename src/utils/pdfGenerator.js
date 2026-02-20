import jsPDF from 'jspdf';

/**
 * Professional Dental Portfolio PDF Generator
 * Creates a luxury-grade, well-formatted PDF document
 */

// Color constants
const COLORS = {
  primary: [13, 148, 136],      // teal-500
  primaryDark: [15, 118, 110],   // teal-600
  primaryLight: [240, 253, 250], // teal-50
  text: [51, 65, 85],           // slate-700
  textLight: [100, 116, 139],   // slate-500
  textMuted: [148, 163, 184],   // slate-400
  heading: [30, 41, 59],        // slate-800
  white: [255, 255, 255],
  line: [226, 232, 240],        // slate-200
  bg: [248, 250, 252],          // slate-50
};

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;

/**
 * Main PDF generation function
 */
export async function generatePortfolioPDF(data) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  let pageNum = 1;

  // Helper: add page footer
  const addFooter = () => {
    const name = `${data.personal.title || ''} ${data.personal.fullName || ''}`.trim();
    pdf.setFontSize(7);
    pdf.setTextColor(...COLORS.textMuted);

    // Footer line
    pdf.setDrawColor(...COLORS.line);
    pdf.line(MARGIN, PAGE_HEIGHT - 15, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 15);

    // Left: name & contact
    pdf.text(name, MARGIN, PAGE_HEIGHT - 10);
    if (data.personal.email) {
      pdf.text(`${data.personal.email}`, MARGIN, PAGE_HEIGHT - 6.5);
    }

    // Right: page number
    pdf.text(`Page ${pageNum}`, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 10, { align: 'right' });

    // Center: target clinic
    pdf.text('Portfolio for Stunning Dentistry', PAGE_WIDTH / 2, PAGE_HEIGHT - 10, { align: 'center' });
  };

  // Helper: add new page
  const addPage = () => {
    pdf.addPage();
    pageNum++;
    addFooter();
  };

  // Helper: check if space is available, add page if not
  const ensureSpace = (needed, currentY) => {
    if (currentY + needed > PAGE_HEIGHT - 25) {
      addPage();
      return MARGIN + 10;
    }
    return currentY;
  };

  // Helper: draw section title
  const drawSectionTitle = (title, y) => {
    y = ensureSpace(20, y);

    // Teal accent bar
    pdf.setFillColor(...COLORS.primary);
    pdf.rect(MARGIN, y, 3, 8, 'F');

    // Title text
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...COLORS.heading);
    pdf.text(title, MARGIN + 7, y + 6);

    // Underline
    pdf.setDrawColor(...COLORS.line);
    pdf.line(MARGIN, y + 11, PAGE_WIDTH - MARGIN, y + 11);

    return y + 16;
  };

  // Helper: draw subsection header
  const drawSubHeader = (text, y) => {
    y = ensureSpace(10, y);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...COLORS.primaryDark);
    pdf.text(text, MARGIN, y);
    return y + 5;
  };

  // Helper: draw body text
  const drawText = (text, y, opts = {}) => {
    const { size = 9, color = COLORS.text, bold = false, indent = 0, maxWidth = CONTENT_WIDTH } = opts;
    pdf.setFontSize(size);
    pdf.setFont('helvetica', bold ? 'bold' : 'normal');
    pdf.setTextColor(...color);

    const lines = pdf.splitTextToSize(text, maxWidth - indent);
    for (const line of lines) {
      y = ensureSpace(5, y);
      pdf.text(line, MARGIN + indent, y);
      y += 4;
    }
    return y;
  };

  // Helper: draw label-value pair
  const drawField = (label, value, y) => {
    if (!value) return y;
    y = ensureSpace(8, y);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...COLORS.textLight);
    pdf.text(label.toUpperCase(), MARGIN, y);

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...COLORS.text);
    const lines = pdf.splitTextToSize(value, CONTENT_WIDTH - 2);
    for (const line of lines) {
      y += 4;
      y = ensureSpace(5, y);
      pdf.text(line, MARGIN, y);
    }
    return y + 3;
  };

  // Helper: add image to PDF
  const addImage = async (base64, x, y, maxW, maxH) => {
    try {
      if (!base64 || !base64.startsWith('data:image/')) return y;
      pdf.addImage(base64, 'JPEG', x, y, maxW, maxH);
      return y + maxH;
    } catch {
      return y;
    }
  };

  // ========================
  // COVER PAGE
  // ========================
  // Background
  pdf.setFillColor(...COLORS.white);
  pdf.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, 'F');

  // Top accent bar
  pdf.setFillColor(...COLORS.primary);
  pdf.rect(0, 0, PAGE_WIDTH, 4, 'F');

  // Vertical accent line
  pdf.setFillColor(...COLORS.primaryLight);
  pdf.rect(MARGIN, 30, 2, 180, 'F');

  // Profile photo
  let coverY = 50;
  if (data.personal.profilePhoto) {
    try {
      pdf.addImage(data.personal.profilePhoto, 'JPEG', MARGIN + 10, coverY, 40, 40);
      coverY += 50;
    } catch {
      coverY += 5;
    }
  }

  // Title
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...COLORS.textLight);
  pdf.text('PROFESSIONAL DENTAL PORTFOLIO', MARGIN + 10, coverY);

  coverY += 12;
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...COLORS.heading);
  const fullName = `${data.personal.title || ''} ${data.personal.fullName || 'Dental Professional'}`.trim();
  const nameLines = pdf.splitTextToSize(fullName, CONTENT_WIDTH - 15);
  for (const nl of nameLines) {
    pdf.text(nl, MARGIN + 10, coverY);
    coverY += 12;
  }

  // Subtle line
  coverY += 5;
  pdf.setDrawColor(...COLORS.primary);
  pdf.setLineWidth(0.5);
  pdf.line(MARGIN + 10, coverY, MARGIN + 70, coverY);
  coverY += 10;

  // Summary
  if (data.personal.summary) {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...COLORS.text);
    const summaryLines = pdf.splitTextToSize(data.personal.summary, CONTENT_WIDTH - 15);
    for (const sl of summaryLines) {
      pdf.text(sl, MARGIN + 10, coverY);
      coverY += 5;
    }
    coverY += 5;
  }

  // Contact info
  coverY += 10;
  pdf.setFontSize(8);
  pdf.setTextColor(...COLORS.textLight);

  const contactItems = [
    data.personal.email && `Email: ${data.personal.email}`,
    data.personal.phone && `Phone: ${data.personal.phone}`,
    data.personal.address && `Address: ${data.personal.address}`,
    data.personal.linkedin && `LinkedIn: ${data.personal.linkedin}`,
  ].filter(Boolean);

  for (const ci of contactItems) {
    pdf.text(ci, MARGIN + 10, coverY);
    coverY += 5;
  }

  // Bottom section: target
  pdf.setFillColor(...COLORS.bg);
  pdf.rect(0, PAGE_HEIGHT - 40, PAGE_WIDTH, 40, 'F');
  pdf.setDrawColor(...COLORS.line);
  pdf.line(0, PAGE_HEIGHT - 40, PAGE_WIDTH, PAGE_HEIGHT - 40);

  pdf.setFontSize(8);
  pdf.setTextColor(...COLORS.textMuted);
  pdf.text('SUBMITTED TO', MARGIN, PAGE_HEIGHT - 30);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...COLORS.primaryDark);
  pdf.text('Stunning Dentistry', MARGIN, PAGE_HEIGHT - 23);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...COLORS.textLight);
  pdf.text('Kailash Colony, Greater Kailash, New Delhi & Netaji Subhash Place, New Delhi', MARGIN, PAGE_HEIGHT - 18);
  pdf.text('www.stunningdentistry.com', MARGIN, PAGE_HEIGHT - 14);

  // ========================
  // TABLE OF CONTENTS
  // ========================
  addPage();
  let tocY = MARGIN + 5;

  pdf.setFillColor(...COLORS.primary);
  pdf.rect(MARGIN, tocY, 3, 8, 'F');
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...COLORS.heading);
  pdf.text('Table of Contents', MARGIN + 7, tocY + 6);
  tocY += 20;

  const tocItems = [
    'Personal Information',
    'Education & Qualifications',
    'Clinical Experience',
    'Clinical Case Portfolio',
    'Technical Skills',
    'Workshops & Conferences',
    'Community Outreach',
    'Testimonials & Recommendations',
  ];

  tocItems.forEach((item, i) => {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...COLORS.text);

    // Number
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...COLORS.primary);
    pdf.text(`${String(i + 1).padStart(2, '0')}`, MARGIN + 5, tocY);

    // Title
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...COLORS.text);
    pdf.text(item, MARGIN + 18, tocY);

    // Dotted line
    pdf.setDrawColor(...COLORS.line);
    pdf.setLineDashPattern([1, 1], 0);
    pdf.line(MARGIN + 75, tocY - 0.5, PAGE_WIDTH - MARGIN - 15, tocY - 0.5);
    pdf.setLineDashPattern([], 0);

    tocY += 10;
  });

  // ========================
  // SECTION 1: PERSONAL INFO
  // ========================
  addPage();
  let y = MARGIN + 5;
  y = drawSectionTitle('Personal Information', y);

  if (data.personal.profilePhoto) {
    try {
      y = ensureSpace(45, y);
      pdf.addImage(data.personal.profilePhoto, 'JPEG', MARGIN, y, 30, 30);
      const infoX = MARGIN + 35;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...COLORS.heading);
      pdf.text(fullName, infoX, y + 8);

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...COLORS.textLight);
      if (data.personal.email) pdf.text(data.personal.email, infoX, y + 14);
      if (data.personal.phone) pdf.text(data.personal.phone, infoX, y + 19);
      if (data.personal.address) pdf.text(data.personal.address, infoX, y + 24);
      y += 35;
    } catch {
      y += 5;
    }
  } else {
    y = drawField('Name', fullName, y);
    y = drawField('Email', data.personal.email, y);
    y = drawField('Phone', data.personal.phone, y);
    y = drawField('Address', data.personal.address, y);
  }

  if (data.personal.linkedin) y = drawField('LinkedIn', data.personal.linkedin, y);

  if (data.personal.summary) {
    y += 3;
    y = drawSubHeader('Professional Summary', y);
    y = drawText(data.personal.summary, y, { indent: 0 });
  }

  // ========================
  // SECTION 2: EDUCATION
  // ========================
  if (data.education.entries?.length > 0) {
    y += 10;
    y = drawSectionTitle('Education & Qualifications', y);

    for (const edu of data.education.entries) {
      y = ensureSpace(25, y);

      // Degree
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...COLORS.heading);
      pdf.text(edu.degree || 'Qualification', MARGIN, y);
      y += 5;

      // University and year
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...COLORS.textLight);
      const eduDetails = [edu.university, edu.year].filter(Boolean).join(' • ');
      if (eduDetails) {
        pdf.text(eduDetails, MARGIN, y);
        y += 4;
      }

      if (edu.licenseNumber) {
        pdf.setFontSize(8);
        pdf.setTextColor(...COLORS.textMuted);
        pdf.text(`License: ${edu.licenseNumber}`, MARGIN, y);
        y += 4;
      }

      if (edu.certificates?.length > 0) {
        pdf.setFontSize(8);
        pdf.setTextColor(...COLORS.primary);
        pdf.text(`${edu.certificates.length} certificate(s) on file`, MARGIN, y);
        y += 4;
      }

      y += 4;
    }
  }

  // ========================
  // SECTION 3: EXPERIENCE
  // ========================
  if (data.experience.entries?.length > 0) {
    y += 5;
    y = drawSectionTitle('Clinical Experience', y);

    for (const exp of data.experience.entries) {
      y = ensureSpace(30, y);

      // Role
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...COLORS.heading);
      pdf.text(exp.role || 'Position', MARGIN, y);
      y += 5;

      // Clinic and location
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...COLORS.primaryDark);
      pdf.text(exp.clinicName || '', MARGIN, y);
      y += 4;

      const expMeta = [exp.location, exp.duration].filter(Boolean).join(' • ');
      if (expMeta) {
        pdf.setTextColor(...COLORS.textLight);
        pdf.text(expMeta, MARGIN, y);
        y += 5;
      }

      if (exp.responsibilities) {
        y = drawSubHeader('Responsibilities', y);
        y = drawText(exp.responsibilities, y, { indent: 2 });
        y += 2;
      }

      if (exp.procedures) {
        y = drawSubHeader('Procedures Performed', y);
        y = drawText(exp.procedures, y, { indent: 2 });
        y += 2;
      }

      // Separator
      pdf.setDrawColor(...COLORS.line);
      pdf.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
      y += 6;
    }
  }

  // ========================
  // SECTION 4: CASES
  // ========================
  if (data.cases.entries?.length > 0) {
    addPage();
    y = MARGIN + 5;
    y = drawSectionTitle('Clinical Case Portfolio', y);

    for (let ci = 0; ci < data.cases.entries.length; ci++) {
      const c = data.cases.entries[ci];

      if (ci > 0) {
        addPage();
        y = MARGIN + 5;
      }

      // Case header
      y = ensureSpace(15, y);
      pdf.setFillColor(...COLORS.bg);
      pdf.rect(MARGIN, y - 3, CONTENT_WIDTH, 12, 'F');
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...COLORS.heading);
      pdf.text(`Case ${ci + 1}: ${c.title || 'Untitled'}`, MARGIN + 3, y + 4);
      y += 14;

      if (c.complaint) { y = drawField('Patient Complaint', c.complaint, y); }
      if (c.diagnosis) { y = drawField('Diagnosis', c.diagnosis, y); }
      if (c.treatmentPlan) { y = drawField('Treatment Plan', c.treatmentPlan, y); }
      if (c.procedure) { y = drawField('Procedure', c.procedure, y); }
      if (c.outcome) { y = drawField('Outcome', c.outcome, y); }

      // Before / After images
      const hasBeforeAfter = (c.beforeImages?.length > 0) || (c.afterImages?.length > 0);
      if (hasBeforeAfter) {
        y += 5;
        y = ensureSpace(60, y);

        // Before images
        if (c.beforeImages?.length > 0) {
          y = drawSubHeader('Before Treatment', y);
          y = await drawImageGrid(pdf, c.beforeImages, y, ensureSpace, addPage);
          y += 3;
        }

        // After images
        if (c.afterImages?.length > 0) {
          y = drawSubHeader('After Treatment', y);
          y = await drawImageGrid(pdf, c.afterImages, y, ensureSpace, addPage);
          y += 3;
        }
      }

      // X-rays
      if (c.xrays?.length > 0) {
        y += 3;
        y = drawSubHeader('X-Ray Images', y);
        y = await drawImageGrid(pdf, c.xrays, y, ensureSpace, addPage);
        y += 3;
      }
    }
  }

  // ========================
  // SECTION 5: SKILLS
  // ========================
  if (data.skills.selected?.length > 0) {
    addPage();
    y = MARGIN + 5;
    y = drawSectionTitle('Technical Skills', y);

    y += 3;
    const cols = 3;
    const colW = CONTENT_WIDTH / cols;

    data.skills.selected.forEach((skill, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const sx = MARGIN + col * colW;
      const sy = y + row * 8;

      // Check if we need a new page
      if (sy > PAGE_HEIGHT - 30) return; // skip if too far down

      // Bullet
      pdf.setFillColor(...COLORS.primary);
      pdf.circle(sx + 2, sy - 1.2, 1, 'F');

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...COLORS.text);
      pdf.text(skill, sx + 5, sy);
    });

    y += Math.ceil(data.skills.selected.length / cols) * 8 + 5;
  }

  // ========================
  // SECTION 6: WORKSHOPS
  // ========================
  if (data.workshops.entries?.length > 0) {
    y += 5;
    y = ensureSpace(20, y);
    y = drawSectionTitle('Workshops & Conferences', y);

    for (const ws of data.workshops.entries) {
      y = ensureSpace(15, y);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...COLORS.heading);
      pdf.text(ws.title || 'Workshop', MARGIN, y);
      y += 4;

      const wsDetails = [ws.organizer, ws.year].filter(Boolean).join(' • ');
      if (wsDetails) {
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...COLORS.textLight);
        pdf.text(wsDetails, MARGIN, y);
        y += 5;
      }
      y += 3;
    }
  }

  // ========================
  // SECTION 7: OUTREACH
  // ========================
  if (data.outreach.entries?.length > 0) {
    y += 5;
    y = ensureSpace(20, y);
    y = drawSectionTitle('Community Outreach', y);

    for (const out of data.outreach.entries) {
      y = ensureSpace(18, y);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...COLORS.heading);
      pdf.text(out.title || 'Activity', MARGIN, y);
      y += 4;

      const outDetails = [out.organization, out.year].filter(Boolean).join(' • ');
      if (outDetails) {
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...COLORS.textLight);
        pdf.text(outDetails, MARGIN, y);
        y += 4;
      }

      if (out.description) {
        y = drawText(out.description, y, { indent: 0 });
      }
      y += 3;
    }
  }

  // ========================
  // SECTION 8: TESTIMONIALS
  // ========================
  if (data.testimonials.entries?.length > 0) {
    addPage();
    y = MARGIN + 5;
    y = drawSectionTitle('Testimonials & Recommendations', y);

    for (const test of data.testimonials.entries) {
      y = ensureSpace(35, y);

      // Quote background
      pdf.setFillColor(...COLORS.bg);
      const quoteLines = pdf.splitTextToSize(test.text || '', CONTENT_WIDTH - 16);
      const quoteHeight = quoteLines.length * 4.5 + 20;
      pdf.roundedRect(MARGIN, y - 3, CONTENT_WIDTH, quoteHeight, 2, 2, 'F');

      // Quote mark
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...COLORS.primaryLight[0] === 240 ? COLORS.primary : COLORS.primary);
      pdf.text('"', MARGIN + 4, y + 6);

      // Quote text
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(...COLORS.text);
      let qy = y + 5;
      for (const ql of quoteLines) {
        pdf.text(ql, MARGIN + 12, qy);
        qy += 4.5;
      }

      // Attribution
      qy += 3;
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...COLORS.heading);
      pdf.text(`— ${test.name || 'Anonymous'}`, MARGIN + 12, qy);

      const attrLine = [test.role, test.organization].filter(Boolean).join(', ');
      if (attrLine) {
        qy += 4;
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...COLORS.textLight);
        pdf.text(attrLine, MARGIN + 16, qy);
      }

      y += quoteHeight + 8;
    }
  }

  // ========================
  // FINAL PAGE: CLOSING
  // ========================
  addPage();
  y = PAGE_HEIGHT / 2 - 30;

  pdf.setFontSize(8);
  pdf.setTextColor(...COLORS.textMuted);
  pdf.text('THANK YOU', PAGE_WIDTH / 2, y, { align: 'center' });
  y += 10;

  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...COLORS.heading);
  pdf.text(fullName, PAGE_WIDTH / 2, y, { align: 'center' });
  y += 10;

  // Accent line
  pdf.setDrawColor(...COLORS.primary);
  pdf.setLineWidth(0.5);
  pdf.line(PAGE_WIDTH / 2 - 25, y, PAGE_WIDTH / 2 + 25, y);
  y += 10;

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...COLORS.textLight);
  const closingContact = [data.personal.email, data.personal.phone].filter(Boolean).join(' • ');
  if (closingContact) {
    pdf.text(closingContact, PAGE_WIDTH / 2, y, { align: 'center' });
    y += 6;
  }
  if (data.personal.address) {
    pdf.text(data.personal.address, PAGE_WIDTH / 2, y, { align: 'center' });
    y += 6;
  }

  y += 10;
  pdf.setFontSize(8);
  pdf.setTextColor(...COLORS.textMuted);
  pdf.text('This portfolio was prepared for submission to', PAGE_WIDTH / 2, y, { align: 'center' });
  y += 5;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...COLORS.primaryDark);
  pdf.text('Stunning Dentistry, New Delhi', PAGE_WIDTH / 2, y, { align: 'center' });
  y += 5;
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...COLORS.textMuted);
  pdf.text('www.stunningdentistry.com', PAGE_WIDTH / 2, y, { align: 'center' });

  // Save
  const fileName = `Dental_Portfolio_${(data.personal.fullName || 'Document').replace(/\s+/g, '_')}.pdf`;
  pdf.save(fileName);
  return true;
}

/**
 * Draw a grid of images on the PDF
 */
async function drawImageGrid(pdf, images, startY, ensureSpace, addPage) {
  if (!images || images.length === 0) return startY;

  const imgPerRow = 3;
  const imgW = (CONTENT_WIDTH - (imgPerRow - 1) * 4) / imgPerRow;
  const imgH = imgW * 0.75;

  let y = startY;
  let x = MARGIN;
  let colCount = 0;

  for (const img of images) {
    if (!img.data || !img.data.startsWith('data:image/')) continue;

    y = ensureSpace(imgH + 5, y);

    try {
      pdf.addImage(img.data, 'JPEG', x, y, imgW, imgH);
    } catch {
      // Draw placeholder
      pdf.setFillColor(...COLORS.bg);
      pdf.rect(x, y, imgW, imgH, 'F');
      pdf.setFontSize(7);
      pdf.setTextColor(...COLORS.textMuted);
      pdf.text('Image', x + imgW / 2, y + imgH / 2, { align: 'center' });
    }

    colCount++;
    if (colCount >= imgPerRow) {
      colCount = 0;
      x = MARGIN;
      y += imgH + 4;
    } else {
      x += imgW + 4;
    }
  }

  // If last row was partial, move y down
  if (colCount > 0) {
    y += imgH + 4;
  }

  return y;
}
