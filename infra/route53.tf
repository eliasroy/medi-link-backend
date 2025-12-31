# Obtener la zona hospedada existente para medilinkpe.click
data "aws_route53_zone" "medilink_zone" {
  name = "medilinkpe.click"
}

# Registro DNS para la validación del certificado ACM
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.api_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.medilink_zone.zone_id
}

# Registro DNS A para api.medilinkpe.click apuntando al ALB
resource "aws_route53_record" "api_subdomain" {
  zone_id = data.aws_route53_zone.medilink_zone.zone_id
  name    = "api.medilinkpe.click"
  type    = "A"

  alias {
    name                   = aws_lb.alb.dns_name
    zone_id                = aws_lb.alb.zone_id
    evaluate_target_health = true
  }
}

