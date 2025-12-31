output "public_subnets" {
  value = module.vpc.public_subnets
}

output "service_name" {
  value = aws_ecs_service.service.name
}

output "task_definition_arn" {
  value = aws_ecs_task_definition.task.arn
}

output "alb_dns_name" {
  value = aws_lb.alb.dns_name
}

output "api_url" {
  description = "URL del backend API"
  value       = "https://api.medilinkpe.click"
}

output "certificate_arn" {
  description = "ARN del certificado ACM"
  value       = aws_acm_certificate.api_cert.arn
}

output "certificate_validation_status" {
  description = "Estado de validación del certificado"
  value       = aws_acm_certificate_validation.api_cert_validation.id
}
