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
