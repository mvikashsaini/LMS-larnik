const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

class CertificateService {
  constructor() {
    this.outputPath = process.env.CERTIFICATE_OUTPUT_PATH || './certificates';
    this.templatePath = process.env.CERTIFICATE_TEMPLATE_PATH || './templates/certificate-template.pdf';
    
    // Ensure output directory exists
    if (!fs.existsSync(this.outputPath)) {
      fs.mkdirSync(this.outputPath, { recursive: true });
    }
  }

  // Generate certificate PDF
  async generateCertificate(certificateData) {
    try {
      const {
        certificateId,
        studentName,
        courseTitle,
        universityName,
        teacherName,
        issuedDate,
        qrCodeData,
        template = 'default'
      } = certificateData;

      const fileName = `certificate-${certificateId}.pdf`;
      const filePath = path.join(this.outputPath, fileName);

      // Create PDF document
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50
        }
      });

      // Pipe to file
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Add background
      this.addBackground(doc);

      // Add header
      this.addHeader(doc, universityName);

      // Add certificate title
      this.addCertificateTitle(doc);

      // Add student name
      this.addStudentName(doc, studentName);

      // Add course details
      this.addCourseDetails(doc, courseTitle, teacherName);

      // Add issue date
      this.addIssueDate(doc, issuedDate);

      // Add certificate ID
      this.addCertificateId(doc, certificateId);

      // Generate and add QR code
      await this.addQRCode(doc, qrCodeData);

      // Add signatures
      this.addSignatures(doc, teacherName, universityName);

      // Add footer
      this.addFooter(doc);

      // Finalize PDF
      doc.end();

      return new Promise((resolve, reject) => {
        stream.on('finish', () => {
          resolve({
            success: true,
            filePath: filePath,
            fileName: fileName,
            fileSize: fs.statSync(filePath).size
          });
        });

        stream.on('error', (error) => {
          reject({
            success: false,
            error: error.message
          });
        });
      });

    } catch (error) {
      console.error('Certificate generation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Add background
  addBackground(doc) {
    // Add border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .lineWidth(3)
      .stroke('#3B82F6');

    // Add watermark
    doc.save()
      .translate(doc.page.width / 2, doc.page.height / 2)
      .rotate(-45)
      .fontSize(60)
      .fillOpacity(0.1)
      .fill('#3B82F6')
      .text('LARNIK LMS', 0, 0, { align: 'center' })
      .restore();
  }

  // Add header
  addHeader(doc, universityName) {
    doc.fontSize(24)
      .fill('#1F2937')
      .text('CERTIFICATE OF COMPLETION', 0, 80, { align: 'center' });

    doc.fontSize(16)
      .fill('#6B7280')
      .text(universityName, 0, 120, { align: 'center' });
  }

  // Add certificate title
  addCertificateTitle(doc) {
    doc.fontSize(18)
      .fill('#374151')
      .text('This is to certify that', 0, 180, { align: 'center' });
  }

  // Add student name
  addStudentName(doc, studentName) {
    doc.fontSize(28)
      .fill('#1F2937')
      .font('Helvetica-Bold')
      .text(studentName, 0, 220, { align: 'center' });
  }

  // Add course details
  addCourseDetails(doc, courseTitle, teacherName) {
    doc.fontSize(16)
      .fill('#374151')
      .font('Helvetica')
      .text('has successfully completed the course', 0, 280, { align: 'center' });

    doc.fontSize(20)
      .fill('#1F2937')
      .font('Helvetica-Bold')
      .text(courseTitle, 0, 320, { align: 'center' });

    doc.fontSize(14)
      .fill('#6B7280')
      .font('Helvetica')
      .text(`Instructor: ${teacherName}`, 0, 360, { align: 'center' });
  }

  // Add issue date
  addIssueDate(doc, issuedDate) {
    const formattedDate = new Date(issuedDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    doc.fontSize(14)
      .fill('#6B7280')
      .text(`Issued on: ${formattedDate}`, 0, 420, { align: 'center' });
  }

  // Add certificate ID
  addCertificateId(doc, certificateId) {
    doc.fontSize(12)
      .fill('#9CA3AF')
      .text(`Certificate ID: ${certificateId}`, 0, 460, { align: 'center' });
  }

  // Add QR code
  async addQRCode(doc, qrCodeData) {
    try {
      // Generate QR code
      const qrCodeBuffer = await QRCode.toBuffer(qrCodeData, {
        width: 100,
        margin: 2,
        color: {
          dark: '#1F2937',
          light: '#FFFFFF'
        }
      });

      // Add QR code to PDF
      doc.image(qrCodeBuffer, doc.page.width - 150, doc.page.height - 150, {
        width: 100,
        height: 100
      });

      // Add QR code label
      doc.fontSize(10)
        .fill('#6B7280')
        .text('Scan to verify', doc.page.width - 150, doc.page.height - 40, {
          align: 'center'
        });

    } catch (error) {
      console.error('QR code generation error:', error);
    }
  }

  // Add signatures
  addSignatures(doc, teacherName, universityName) {
    const signatureY = doc.page.height - 200;

    // Teacher signature
    doc.fontSize(12)
      .fill('#6B7280')
      .text('_________________', 100, signatureY, { align: 'center' });

    doc.fontSize(10)
      .fill('#9CA3AF')
      .text(teacherName, 100, signatureY + 20, { align: 'center' });

    doc.fontSize(8)
      .fill('#9CA3AF')
      .text('Course Instructor', 100, signatureY + 35, { align: 'center' });

    // University signature
    doc.fontSize(12)
      .fill('#6B7280')
      .text('_________________', doc.page.width - 200, signatureY, { align: 'center' });

    doc.fontSize(10)
      .fill('#9CA3AF')
      .text(universityName, doc.page.width - 200, signatureY + 20, { align: 'center' });

    doc.fontSize(8)
      .fill('#9CA3AF')
      .text('University Authority', doc.page.width - 200, signatureY + 35, { align: 'center' });
  }

  // Add footer
  addFooter(doc) {
    doc.fontSize(8)
      .fill('#9CA3AF')
      .text('This certificate is digitally generated and can be verified online', 0, doc.page.height - 30, { align: 'center' });

    doc.fontSize(8)
      .fill('#9CA3AF')
      .text('Larnik LMS - Empowering Education', 0, doc.page.height - 20, { align: 'center' });
  }

  // Generate QR code data
  generateQRCodeData(certificateId, studentId, courseId, issuedDate) {
    const data = {
      certificateId: certificateId,
      studentId: studentId,
      courseId: courseId,
      issuedDate: issuedDate,
      verificationUrl: `${process.env.FRONTEND_URL}/verify/${certificateId}`,
      timestamp: Date.now()
    };

    return JSON.stringify(data);
  }

  // Verify certificate
  async verifyCertificate(certificateId) {
    try {
      const Certificate = require('../models/Certificate');
      const certificate = await Certificate.findOne({ certificateId });

      if (!certificate) {
        return {
          valid: false,
          reason: 'Certificate not found'
        };
      }

      const validation = certificate.validate();
      return validation;

    } catch (error) {
      console.error('Certificate verification error:', error);
      return {
        valid: false,
        reason: 'Verification failed'
      };
    }
  }

  // Delete certificate file
  deleteCertificateFile(fileName) {
    try {
      const filePath = path.join(this.outputPath, fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return { success: true };
      }
      return { success: false, error: 'File not found' };
    } catch (error) {
      console.error('Certificate file deletion error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get certificate file info
  getCertificateFileInfo(fileName) {
    try {
      const filePath = path.join(this.outputPath, fileName);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        return {
          success: true,
          filePath: filePath,
          fileName: fileName,
          fileSize: stats.size,
          createdDate: stats.birthtime
        };
      }
      return { success: false, error: 'File not found' };
    } catch (error) {
      console.error('Certificate file info error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new CertificateService();
