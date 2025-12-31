# Certificado SSL para el subdominio api.medilinkpe.click
resource "aws_acm_certificate" "api_cert" {
  domain_name       = "api.medilinkpe.click"
  validation_method = "DNS"

  # Opcional: incluir también el dominio raíz y wildcard
  subject_alternative_names = [
    "*.medilinkpe.click"
  ]

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = "medilink-api-certificate"
  }
}

# Validación DNS del certificado ACM
resource "aws_acm_certificate_validation" "api_cert_validation" {
  certificate_arn = aws_acm_certificate.api_cert.arn
  validation_record_fqdns = [
    for record in aws_route53_record.cert_validation : record.fqdn
  ]

  timeouts {
    create = "5m"
  }
}

